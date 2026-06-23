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
  | 'other';

export type Category = {
  key: CategoryKey;
  label: string;
  emoji: string;
  gradient: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: CategoryKey;
  createdAt: string;
};

export type FinanceState = {
  salary: number;
  savingsPercent: number;
  goalName: string;
  goalAmount: number;
  monthlySavings: Record<string, number>;
  expenses: Expense[];
};

export type ExpenseDraft = {
  title: string;
  amount: string;
  category: CategoryKey;
};
