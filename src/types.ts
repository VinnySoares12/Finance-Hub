// Keys are open strings (stable slugs) so the taxonomy stays data-driven and
// ready for user-created custom categories in the future.
export type CategoryKey = string;
export type SubcategoryKey = string;

export type Subcategory = {
  key: SubcategoryKey;
  name: string;
  icon: string;
};

export type Category = {
  key: CategoryKey;
  name: string;
  icon: string;
  gradient: string;
  subcategories: Subcategory[];
};

export type PaymentMethod = 'cash' | 'credit';

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: CategoryKey;
  subcategory: SubcategoryKey;
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
  subcategory: SubcategoryKey;
  paymentMethod: PaymentMethod;
  installments: number;
  dueDate: string;
};
