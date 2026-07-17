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

const HEADER_FILL = 'FFDDD6FE';
const CURRENCY_FORMAT = '"R$" #,##0.00';

// Nomes de aba do Excel nao aceitam estes caracteres nem passam de 31 letras;
// o rotulo do mes (ex.: "julho de 2026") nunca deveria conter nenhum, mas
// sanitizamos porque exceljs lanca excecao em runtime se um escapar.
const sanitizeSheetName = (name: string) => name.replace(/[\\/*?:[\]]/g, '').slice(0, 31);

export const exportExpensesToExcel = async ({
  expenses,
  monthLabel,
  monthKey,
  locale,
  labels,
  getCategoryLabel
}: ExcelExportOptions) => {
  const total = expenses.reduce((sum, expense) => sum + (Number.isFinite(expense.amount) ? expense.amount : 0), 0);

  // Import dinamico: exceljs pesa ~250KB gzip e so' e' usado neste botao de
  // exportar, entao carrega-lo no bundle principal penalizaria todo mundo
  // (inclusive quem so' faz login) so' para uma acao que a maioria nao usa.
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const sheetName = sanitizeSheetName(monthLabel) || monthKey;
  const sheet = workbook.addWorksheet(sheetName || 'Despesas');

  sheet.columns = [{ width: 14 }, { width: 34 }, { width: 22 }, { width: 16 }];

  sheet.mergeCells(1, 1, 1, 4);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = `${labels.reportTitle} — ${monthLabel}`;
  titleCell.font = { bold: true, size: 14 };

  sheet.addRow([]);

  const headerRow = sheet.addRow([labels.date, labels.description, labels.category, labels.amount]);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } };
  });

  if (expenses.length > 0) {
    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt).toLocaleDateString(locale);
      const amount = Number.isFinite(expense.amount) ? expense.amount : 0;
      const row = sheet.addRow([date, expense.title, getCategoryLabel(expense), amount]);
      row.getCell(4).numFmt = CURRENCY_FORMAT;
    });
  } else {
    sheet.addRow([labels.empty]);
  }

  sheet.addRow([]);

  const totalRow = sheet.addRow([labels.total, '', '', total]);
  totalRow.font = { bold: true };
  totalRow.getCell(4).numFmt = CURRENCY_FORMAT;

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `despesas-${monthKey}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
