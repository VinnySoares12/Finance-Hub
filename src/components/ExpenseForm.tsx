import { useState } from 'react';
import type { FormEvent } from 'react';
import { categories } from '../data/categories';
import type { CategoryKey, ExpenseDraft } from '../types';
import { useI18n } from '../i18n';
import { parseMoney } from '../utils/formatters';

type ExpenseFormProps = {
  onAddExpense: (title: string, amount: number, category: CategoryKey) => void;
};

const initialDraft: ExpenseDraft = {
  title: '',
  amount: '',
  category: 'market'
};

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<ExpenseDraft>(initialDraft);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = draft.title.trim();
    const amount = parseMoney(draft.amount);

    if (!title) {
      setError(t('expenseNameError'));
      return;
    }

    if (amount <= 0) {
      setError(t('expenseValueError'));
      return;
    }

    onAddExpense(title, amount, draft.category);
    setDraft(initialDraft);
    setError('');
  };

  return (
    <form className="expense-form panel" onSubmit={handleSubmit}>
      <div className="section-title">
        <span>➕</span>
        <div>
          <p>{t('newExpense')}</p>
          <strong>{t('addMonthlyExpense')}</strong>
        </div>
      </div>

      <label>
        {t('expenseName')}
        <input
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          placeholder={t('expensePlaceholder')}
        />
      </label>

      <label>
        {t('value')}
        <input
          value={draft.amount}
          onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
          inputMode="decimal"
          placeholder="Ex: 250,00"
        />
      </label>

      <label>
        {t('category')}
        <select
          value={draft.category}
          onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as CategoryKey }))}
        >
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.emoji} {t(`category.${category.key}`)}
            </option>
          ))}
        </select>
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="submit" className="primary-button">
        {t('addExpense')}
      </button>
    </form>
  );
}
