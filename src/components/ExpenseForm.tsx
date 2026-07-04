import { useState } from 'react';
import type { FormEvent } from 'react';
import { categories } from '../data/categories';
import type { CategoryKey, ExpenseDraft, PaymentMethod } from '../types';
import { useI18n } from '../i18n';
import { parseMoney } from '../utils/formatters';

type ExpenseFormProps = {
  onAddExpense: (title: string, amount: number, category: CategoryKey, paymentMethod: PaymentMethod, installments: number, dueDate: string) => void;
};

const initialDraft: ExpenseDraft = {
  title: '',
  amount: '',
  category: 'market',
  paymentMethod: 'cash',
  installments: 1,
  dueDate: ''
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

    onAddExpense(title, amount, draft.category, draft.paymentMethod, draft.installments, draft.dueDate);
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

      <label>
        Forma de Pagamento
        <select
          value={draft.paymentMethod}
          onChange={(event) => setDraft((current) => ({ ...current, paymentMethod: event.target.value as PaymentMethod, installments: 1 }))}
        >
          <option value="cash">À Vista (Dinheiro/Débito/PIX)</option>
          <option value="credit">Cartão de Crédito</option>
        </select>
      </label>

      {draft.paymentMethod === 'credit' && (
        <label>
          Parcelas
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
        Data de Vencimento (Opcional)
        {draft.paymentMethod === 'cash' && <span style={{ fontSize: '0.85em', opacity: 0.7 }}> - Para contas recorrentes</span>}
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
