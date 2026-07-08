export type CategoryKey =
  | 'market'
  | 'transport'
  | 'water'
  | 'electricity'
  | 'internet'
  | 'housing'
  | 'leisure'
  | 'health'
  | 'education'
  | 'card'
  | 'gifts'
  | 'other';

export type Category = {
  key: CategoryKey;
  label: string;
  emoji: string;
  gradient: string;
};

export type PaymentMethod = 'cash' | 'credit';

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: CategoryKey;
  createdAt: string;
  paymentMethod: PaymentMethod;
  installments?: number;
  installmentGroupId?: string;
  dueDate?: string;
};

export type FinanceState = {
  salary: number;
  savingsPercent: number;
  goalName: string;
  goalAmount: number;
  initialSaved: number;
  monthlySavings: Record<string, number>;
  expenses: Expense[];
};

export type ExpenseDraft = {
  title: string;
  amount: string;
  category: CategoryKey;
  paymentMethod: PaymentMethod;
  installments: number;
  dueDate: string;
};
