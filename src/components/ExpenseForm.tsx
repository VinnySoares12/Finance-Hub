import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { categories, getCategory } from '../data/categories';
import type { CategoryKey, ExpenseDraft, PaymentMethod, SubcategoryKey } from '../types';
import { useI18n } from '../i18n';
import { parseMoney } from '../utils/formatters';
import { SearchableSelect } from './SearchableSelect';

type ExpenseFormProps = {
  onAddExpense: (
    title: string,
    amount: number,
    category: CategoryKey,
    subcategory: SubcategoryKey,
    paymentMethod: PaymentMethod,
    installments: number,
    dueDate: string
  ) => void;
};

const initialDraft: ExpenseDraft = {
  title: '',
  amount: '',
  category: '',
  subcategory: '',
  paymentMethod: 'cash',
  installments: 1,
  dueDate: ''
};

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const { t, categoryLabel, subcategoryLabel } = useI18n();
  const [draft, setDraft] = useState<ExpenseDraft>(initialDraft);
  const [error, setError] = useState('');

  const categoryOptions = useMemo(
    () => categories.map((category) => ({
      value: category.key,
      label: categoryLabel(category.key),
      icon: category.icon
    })),
    [categoryLabel]
  );

  const subcategoryOptions = useMemo(() => {
    if (!draft.category) return [];
    return getCategory(draft.category).subcategories.map((sub) => ({
      value: sub.key,
      label: subcategoryLabel(draft.category, sub.key),
      icon: sub.icon
    }));
  }, [draft.category, subcategoryLabel]);

  const handleSelectCategory = (category: CategoryKey) => {
    // Changing the main category always clears the subcategory (spec rule).
    setDraft((current) => ({ ...current, category, subcategory: '' }));
  };

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

    if (!draft.category) {
      setError(t('expenseCategoryError'));
      return;
    }

    if (!draft.subcategory) {
      setError(t('expenseSubcategoryError'));
      return;
    }

    onAddExpense(
      title,
      amount,
      draft.category,
      draft.subcategory,
      draft.paymentMethod,
      draft.installments,
      draft.dueDate
    );
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
        <SearchableSelect
          options={categoryOptions}
          value={draft.category}
          onChange={handleSelectCategory}
          placeholder={t('selectCategoryPlaceholder')}
          searchPlaceholder={t('searchPlaceholder')}
          emptyText={t('noResults')}
          ariaLabel={t('category')}
        />
      </label>

      <label>
        {t('subcategory')}
        <SearchableSelect
          options={subcategoryOptions}
          value={draft.subcategory}
          onChange={(subcategory) => setDraft((current) => ({ ...current, subcategory }))}
          placeholder={t('selectSubcategoryPlaceholder')}
          searchPlaceholder={t('searchPlaceholder')}
          emptyText={t('noResults')}
          disabled={!draft.category}
          disabledText={t('subcategoryDisabledHint')}
          ariaLabel={t('subcategory')}
        />
      </label>

      <label>
        {t('paymentMethod')}
        <select
          value={draft.paymentMethod}
          onChange={(event) => setDraft((current) => ({ ...current, paymentMethod: event.target.value as PaymentMethod, installments: 1 }))}
        >
          <option value="cash">{t('paymentCash')}</option>
          <option value="credit">{t('paymentCredit')}</option>
        </select>
      </label>

      {draft.paymentMethod === 'credit' && (
        <label>
          {t('installments')}
          <select
            value={draft.installments}
            onChange={(event) => setDraft((current) => ({ ...current, installments: parseInt(event.target.value) }))}
          >
            {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}x
              </option>
            ))}
          </select>
        </label>
      )}

      <label>
        {t('dueDate')}
        {draft.paymentMethod === 'cash' && <span style={{ fontSize: '0.85em', opacity: 0.7 }}>{t('dueDateRecurringHint')}</span>}
        <input
          type="date"
          value={draft.dueDate}
          onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="submit" className="primary-button">
        {t('addExpense')}
      </button>
    </form>
  );
}
