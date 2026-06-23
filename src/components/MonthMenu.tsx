import { useI18n } from '../i18n';

type MonthOption = {
  key: string;
  label: string;
};

type MonthMenuProps = {
  isOpen: boolean;
  months: MonthOption[];
  selectedMonth: string;
  monthlySavings: Record<string, number>;
  onToggle: () => void;
  onClose: () => void;
  onSelectMonth: (month: string) => void;
};

export function MonthMenu({
  isOpen,
  months,
  selectedMonth,
  monthlySavings,
  onToggle,
  onClose,
  onSelectMonth
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
          <button type="button" onClick={onClose} aria-label={t('closeMenu')}>×</button>
        </div>

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
        </div>
      </aside>
    </>
  );
}
