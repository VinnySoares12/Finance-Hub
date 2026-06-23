import { categories } from '../data/categories';
import type { Expense } from '../types';
import { useI18n } from '../i18n';

type CategoryBreakdownProps = {
  expenses: Expense[];
  totalExpenses: number;
};

export function CategoryBreakdown({ expenses, totalExpenses }: CategoryBreakdownProps) {
  const { t, currency } = useI18n();
  const totals = categories
    .map((category) => {
      const amount = expenses
        .filter((expense) => expense.category === category.key)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        ...category,
        amount,
        percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
      };
    })
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <section className="panel breakdown">
      <div className="section-title">
        <span>📊</span>
        <div>
          <p>{t('categories')}</p>
          <strong>{t('moneyDestination')}</strong>
        </div>
      </div>

      {totals.length ? (
        <div className="breakdown__items">
          {totals.map((category) => (
            <div className="breakdown-row" key={category.key}>
              <div>
                <span>{category.emoji}</span>
                <strong>{t(`category.${category.key}`)}</strong>
              </div>
              <div className="breakdown-row__bar">
                <i style={{ width: `${category.percent}%` }} />
              </div>
              <small>{currency(category.amount)} • {category.percent}%</small>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted-text">{t('categoryEmpty')}</p>
      )}
    </section>
  );
}
