import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { parseMoney } from '../utils/formatters';

type MoneyInputProps = {
  value: number;
  onValueChange: (value: number) => void;
  placeholder?: string;
};

const valueToInput = (value: number, locale: string) => {
  if (!value) return '';

  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    maximumFractionDigits: 2
  }).format(value);
};

export function MoneyInput({ value, onValueChange, placeholder }: MoneyInputProps) {
  const { locale } = useI18n();
  const previousLocale = useRef(locale);
  const [inputValue, setInputValue] = useState(() => valueToInput(value, locale));

  useEffect(() => {
    const localeChanged = previousLocale.current !== locale;

    if (localeChanged || Math.abs(parseMoney(inputValue) - value) > 0.000001) {
      setInputValue(valueToInput(value, locale));
    }

    previousLocale.current = locale;
  }, [value, locale, inputValue]);

  const handleChange = (nextValue: string) => {
    setInputValue(nextValue);
    onValueChange(parseMoney(nextValue));
  };

  return (
    <input
      value={inputValue}
      onChange={(event) => handleChange(event.target.value)}
      inputMode="decimal"
      placeholder={placeholder}
    />
  );
}
