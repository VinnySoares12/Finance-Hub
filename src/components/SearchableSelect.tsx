import { useEffect, useMemo, useRef, useState } from 'react';

export type SelectOption = {
  value: string;
  label: string;
  icon?: string;
};

type SearchableSelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
  disabledText?: string;
  ariaLabel?: string;
};

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled = false,
  disabledText,
  ariaLabel
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((option) => option.value === value) ?? null;

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return options;
    return options.filter((option) => normalize(option.label).includes(term));
  }, [options, query]);

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  // Focus the search field and reset state whenever the dropdown opens.
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      searchRef.current?.focus();
    }
  }, [isOpen]);

  // Keep the highlighted option in bounds and scrolled into view.
  useEffect(() => {
    if (activeIndex >= filtered.length) {
      setActiveIndex(filtered.length > 0 ? filtered.length - 1 : 0);
    }
  }, [filtered, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const node = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const commit = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) commit(option.value);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className="searchable-select" ref={containerRef}>
      <button
        type="button"
        className="searchable-select__trigger"
        onClick={() => !disabled && setIsOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className="searchable-select__value">
          {selected ? (
            <>
              {selected.icon ? <span aria-hidden="true">{selected.icon}</span> : null}
              <span>{selected.label}</span>
            </>
          ) : (
            <span className="searchable-select__placeholder">
              {disabled && disabledText ? disabledText : placeholder}
            </span>
          )}
        </span>
        <span className="searchable-select__chevron" aria-hidden="true">▾</span>
      </button>

      {isOpen && !disabled ? (
        <div className="searchable-select__panel">
          <div className="searchable-select__search">
            <span aria-hidden="true">🔍</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </div>

          {filtered.length ? (
            <ul className="searchable-select__list" role="listbox" ref={listRef}>
              {filtered.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      'searchable-select__option',
                      isActive ? 'is-active' : '',
                      isSelected ? 'is-selected' : ''
                    ].filter(Boolean).join(' ')}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      commit(option.value);
                    }}
                  >
                    {option.icon ? <span aria-hidden="true">{option.icon}</span> : null}
                    <span>{option.label}</span>
                    {isSelected ? <span className="searchable-select__check" aria-hidden="true">✓</span> : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="searchable-select__empty">{emptyText}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
