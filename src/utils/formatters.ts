import type { Expense } from '../types';

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2
});

export const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 1
});

export const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

export const formatPercent = (value: number) => percentageFormatter.format((value || 0) / 100);

export const parseMoney = (value: string) => {
  const cleaned = value.replace(/[^\d.,]/g, '');

  if (!cleaned) return 0;

  const dots = [...cleaned.matchAll(/\./g)];
  const commas = [...cleaned.matchAll(/,/g)];
  const hasBothSeparators = dots.length > 0 && commas.length > 0;
  let normalized = cleaned;

  if (hasBothSeparators) {
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    const decimalSeparatorIndex = Math.max(lastDot, lastComma);
    const integerPart = cleaned.slice(0, decimalSeparatorIndex).replace(/[.,]/g, '');
    const decimalPart = cleaned.slice(decimalSeparatorIndex + 1).replace(/[.,]/g, '');
    normalized = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  } else {
    const separator = dots.length ? '.' : commas.length ? ',' : '';

    if (separator) {
      const separatorMatches = separator === '.' ? dots : commas;
      const lastSeparatorIndex = cleaned.lastIndexOf(separator);
      const decimalLength = cleaned.length - lastSeparatorIndex - 1;
      const shouldUseDecimal = decimalLength > 0
        && decimalLength <= 2;

      if (separatorMatches.length === 1 && shouldUseDecimal) {
        normalized = cleaned.replace(separator, '.');
      } else if (separatorMatches.length > 1 && shouldUseDecimal) {
        const integerPart = cleaned.slice(0, lastSeparatorIndex).replace(/[.,]/g, '');
        const decimalPart = cleaned.slice(lastSeparatorIndex + 1);
        normalized = `${integerPart}.${decimalPart}`;
      } else {
        normalized = cleaned.replace(/[.,]/g, '');
      }
    }
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

type ExcelExportOptions = {
  expenses: Expense[];
  monthLabel: string;
  monthKey: string;
  locale: string;
  labels: {
    reportTitle: string;
    date: string;
    description: string;
    category: string;
    amount: string;
    total: string;
    empty: string;
  };
  getCategoryLabel: (expense: Expense) => string;
};

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')
  .replace(/[\r\n]+/g, ' ');

const excelStringCell = (value: string, styleId?: string) =>
  `<Cell${styleId ? ` ss:StyleID="${styleId}"` : ''}><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;

const excelNumberCell = (value: number, styleId?: string) =>
  `<Cell${styleId ? ` ss:StyleID="${styleId}"` : ''}><Data ss:Type="Number">${value}</Data></Cell>`;

export const exportExpensesToExcel = ({
  expenses,
  monthLabel,
  monthKey,
  locale,
  labels,
  getCategoryLabel
}: ExcelExportOptions) => {
  const total = expenses.reduce((sum, expense) => sum + (Number.isFinite(expense.amount) ? expense.amount : 0), 0);
  const rows = expenses.length > 0
    ? expenses.map((expense) => {
        const date = new Date(expense.createdAt).toLocaleDateString(locale);
        const amount = Number.isFinite(expense.amount) ? expense.amount : 0;

        return `<Row>${excelStringCell(date)}${excelStringCell(expense.title)}${excelStringCell(getCategoryLabel(expense))}${excelNumberCell(amount, 'Currency')}</Row>`;
      }).join('')
    : `<Row>${excelStringCell(labels.empty)}</Row>`;

  const worksheetName = monthLabel.slice(0, 31) || monthKey;
  const spreadsheet = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#DDD6FE" ss:Pattern="Solid"/></Style>
  <Style ss:ID="Title"><Font ss:Bold="1" ss:Size="14"/></Style>
  <Style ss:ID="Currency"><NumberFormat ss:Format="&quot;R$&quot; #,##0.00"/></Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(worksheetName)}">
  <Table>
   <Column ss:Width="90"/><Column ss:Width="220"/><Column ss:Width="140"/><Column ss:Width="100"/>
   <Row>${excelStringCell(`${labels.reportTitle} — ${monthLabel}`, 'Title')}</Row>
   <Row/>
   <Row>${excelStringCell(labels.date, 'Header')}${excelStringCell(labels.description, 'Header')}${excelStringCell(labels.category, 'Header')}${excelStringCell(labels.amount, 'Header')}</Row>
   ${rows}
   <Row/>
   <Row>${excelStringCell(labels.total, 'Header')}<Cell/><Cell/>${excelNumberCell(total, 'Currency')}</Row>
  </Table>
 </Worksheet>
</Workbook>`;

  // O conteudo gerado e' SpreadsheetML (XML), nao o binario BIFF do .xls de
  // verdade. Com extensao .xls o Excel detecta a incompatibilidade e mostra
  // um aviso de seguranca antes de abrir; com .xml ele reconhece o formato
  // e abre direto.
  const blob = new Blob([spreadsheet], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `despesas-${monthKey}.xml`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
