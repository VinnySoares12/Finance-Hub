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
