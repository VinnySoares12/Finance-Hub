import { getCategory } from '../data/categories';
import type { Expense } from '../types';
import { useI18n } from '../i18n';

type ExpenseListProps = {
  expenses: Expense[];
  onRemoveExpense: (id: string) => void;
};

export function ExpenseList({ expenses, onRemoveExpense }: ExpenseListProps) {
  const { t, currency } = useI18n();
  if (!expenses.length) {
    return (
      <section className="panel empty-state">
        <span>🧾</span>
        <h2>{t('noExpenses')}</h2>
        <p>{t('noExpensesText')}</p>
      </section>
    );
  }

  return (
    <section className="panel expense-list">
      <div className="section-title">
        <span>🧾</span>
        <div>
          <p>{t('monthlyExpenses')}</p>
          <strong>{t('itemsRegistered', { count: expenses.length })}</strong>
        </div>
      </div>

      <div className="expense-list__items">
        {expenses.map((expense) => {
          const category = getCategory(expense.category);

          return (
            <article className="expense-item" key={expense.id}>
              <div className={`expense-item__emoji ${category.gradient}`}>{category.emoji}</div>
              <div className="expense-item__content">
                <strong>{expense.title}</strong>
                <span>{t(`category.${category.key}`)}</span>
              </div>
              <div className="expense-item__amount">
                <strong>{currency(expense.amount)}</strong>
                <button type="button" onClick={() => onRemoveExpense(expense.id)} aria-label={t('removeExpense', { name: expense.title })}>
                  {t('remove')}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
