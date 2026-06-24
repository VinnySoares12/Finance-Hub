import { useI18n } from '../i18n';

type MonthOption = {
  key: string;
  label: string;
};

type MonthMenuProps = {
  isOpen: boolean;
  months: MonthOption[];
  years: number[];
  selectedMonth: string;
  monthlySavings: Record<string, number>;
  expenseCount: number;
  onToggle: () => void;
  onClose: () => void;
  onSelectMonth: (month: string) => void;
  onSelectYear: (year: number) => void;
  onExportExpenses: () => void;
};

export function MonthMenu({
  isOpen,
  months,
  years,
  selectedMonth,
  monthlySavings,
  expenseCount,
  onToggle,
  onClose,
  onSelectMonth,
  onSelectYear,
  onExportExpenses
}: MonthMenuProps) {
  const { t, currency } = useI18n();
  return (
    <>
      <button
        className={`month-menu-button ${isOpen ? 'is-open' : ''}`}
        type="button"
        onClick={onToggle}
        aria-label={t('openHistory')}
        aria-expanded={isOpen}
      >
        <i />
        <i />
        <i />
      </button>

      <button
        className={`month-menu-backdrop ${isOpen ? 'is-open' : ''}`}
        type="button"
        onClick={onClose}
        aria-label={t('closeHistory')}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside className={`month-menu ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="month-menu__header">
          <div>
            <span>{t('history')}</span>
            <strong>{t('historyTitle')}</strong>
          </div>
        </div>

        <label className="month-menu__year">
          <span>{t('selectYear')}</span>
          <select
            value={Number(selectedMonth.slice(0, 4))}
            onChange={(event) => onSelectYear(Number(event.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>

        <div className="month-menu__list">
          {months.map((month) => {
            const saved = monthlySavings[month.key] ?? 0;
            const isActive = month.key === selectedMonth;

            return (
              <button
                className={isActive ? 'is-active' : ''}
                type="button"
                key={month.key}
                onClick={() => {
                  onSelectMonth(month.key);
                  onClose();
                }}
              >
                <span>
                  <strong>{month.label}</strong>
                  <small>{saved > 0 ? t('registered') : t('notRegistered')}</small>
                </span>
                <b>{currency(saved)}</b>
              </button>
            );
          })}

          <button
            className="month-menu__export"
            type="button"
            onClick={onExportExpenses}
          >
            <span>
              <strong>{t('exportExpenses')}</strong>
              <small>{t('exportExpensesHint', { count: expenseCount })}</small>
            </span>
            <b aria-hidden="true">↓ XLS</b>
          </button>
        </div>
      </aside>
    </>
  );
}
