import { useEffect, useState } from 'react';
import { parseMoney } from '../utils/formatters';

type MoneyInputProps = {
  value: number;
  onValueChange: (value: number) => void;
  placeholder?: string;
};

const valueToInput = (value: number) => (
  value ? String(value).replace('.', ',') : ''
);

export function MoneyInput({ value, onValueChange, placeholder }: MoneyInputProps) {
  const [inputValue, setInputValue] = useState(() => valueToInput(value));

  useEffect(() => {
    if (Math.abs(parseMoney(inputValue) - value) > 0.000001) {
      setInputValue(valueToInput(value));
    }
  }, [value]);

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
