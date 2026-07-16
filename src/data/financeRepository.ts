import { supabase } from '../lib/supabase';
import { isUuid, uuid } from '../utils/id';
import { resolveCategory } from './categories';
import type { Expense, FinanceState, PaymentMethod } from '../types';

const LEGACY_KEY = 'finance-hub-state';
const LEGACY_BACKUP_KEY = 'finance-hub-state.imported-backup';

export const emptyFinanceState: FinanceState = {
  salary: 0,
  savingsPercent: 20,
  goalName: '',
  goalAmount: 0,
  initialSaved: 0,
  monthlySavings: {},
  expenses: []
};

export type FinanceSettings = Pick<
  FinanceState,
  'salary' | 'savingsPercent' | 'goalName' | 'goalAmount' | 'initialSaved'
>;

type ExpenseRow = {
  id: string;
  title: string;
  amount: number | string;
  category: string;
  subcategory: string;
  payment_method: string;
  installments: number | null;
  installment_group_id: string | null;
  due_date: string | null;
  created_at: string;
};

const toExpense = (row: ExpenseRow): Expense => ({
  id: row.id,
  title: row.title,
  // numeric do Postgres pode chegar como string dependendo da precisão.
  amount: Number(row.amount),
  category: row.category,
  subcategory: row.subcategory,
  createdAt: row.created_at,
  paymentMethod: row.payment_method as PaymentMethod,
  installments: row.installments ?? undefined,
  installmentGroupId: row.installment_group_id ?? undefined,
  dueDate: row.due_date ?? undefined
});

const toExpenseRow = (expense: Expense, userId: string) => ({
  id: expense.id,
  user_id: userId,
  title: expense.title,
  amount: expense.amount,
  category: expense.category,
  subcategory: expense.subcategory,
  payment_method: expense.paymentMethod,
  installments: expense.installments ?? null,
  installment_group_id: expense.installmentGroupId ?? null,
  due_date: expense.dueDate ?? null,
  created_at: expense.createdAt
});

export async function fetchFinanceState(userId: string): Promise<FinanceState> {
  const [settings, savings, expenses] = await Promise.all([
    supabase
      .from('finance_settings')
      .select('salary, savings_percent, goal_name, goal_amount, initial_saved')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase.from('monthly_savings').select('month_key, amount').eq('user_id', userId),
    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  ]);

  if (settings.error) throw settings.error;
  if (savings.error) throw savings.error;
  if (expenses.error) throw expenses.error;

  const monthlySavings: Record<string, number> = {};
  for (const row of savings.data ?? []) {
    monthlySavings[row.month_key] = Number(row.amount);
  }

  return {
    // A linha de settings é criada por trigger no signup, mas o fallback cobre
    // contas criadas antes da trigger existir.
    salary: settings.data ? Number(settings.data.salary) : emptyFinanceState.salary,
    savingsPercent: settings.data
      ? Number(settings.data.savings_percent)
      : emptyFinanceState.savingsPercent,
    goalName: settings.data?.goal_name ?? emptyFinanceState.goalName,
    goalAmount: settings.data ? Number(settings.data.goal_amount) : emptyFinanceState.goalAmount,
    initialSaved: settings.data
      ? Number(settings.data.initial_saved)
      : emptyFinanceState.initialSaved,
    monthlySavings,
    expenses: ((expenses.data ?? []) as ExpenseRow[]).map(toExpense)
  };
}

export async function saveSettings(userId: string, settings: FinanceSettings): Promise<void> {
  const { error } = await supabase.from('finance_settings').upsert(
    {
      user_id: userId,
      salary: settings.salary,
      savings_percent: settings.savingsPercent,
      goal_name: settings.goalName,
      goal_amount: settings.goalAmount,
      initial_saved: settings.initialSaved
    },
    { onConflict: 'user_id' }
  );

  if (error) throw error;
}

export async function saveMonthlySaving(
  userId: string,
  monthKey: string,
  amount: number
): Promise<void> {
  const { error } = await supabase
    .from('monthly_savings')
    .upsert({ user_id: userId, month_key: monthKey, amount }, { onConflict: 'user_id,month_key' });

  if (error) throw error;
}

export async function deleteMonthlySavings(userId: string, monthKeys: string[]): Promise<void> {
  if (!monthKeys.length) return;

  const { error } = await supabase
    .from('monthly_savings')
    .delete()
    .eq('user_id', userId)
    .in('month_key', monthKeys);

  if (error) throw error;
}

export async function insertExpenses(userId: string, expenses: Expense[]): Promise<void> {
  if (!expenses.length) return;

  const { error } = await supabase
    .from('expenses')
    .insert(expenses.map((expense) => toExpenseRow(expense, userId)));

  if (error) throw error;
}

export async function deleteExpenses(userId: string, ids: string[]): Promise<void> {
  if (!ids.length) return;

  // O `.eq('user_id')` é redundante com o RLS, mas mantém a intenção explícita
  // e evita um round-trip inútil caso algum id não seja do usuário.
  const { error } = await supabase.from('expenses').delete().eq('user_id', userId).in('id', ids);

  if (error) throw error;
}

// -----------------------------------------------------------------------------
// Estado legado do localStorage (versão pré-Supabase do app)
// -----------------------------------------------------------------------------

// As três despesas de exemplo que o app antigo semeava no primeiro acesso.
const isSeedExpense = (expense: Expense) => expense.id.startsWith('seed-');

// Um localStorage que só tem os dados de demonstração intocados não é dado do
// usuário — importar isso encheria uma conta nova de despesas falsas.
const isUntouchedDemo = (state: FinanceState) =>
  state.salary === 0 &&
  state.goalName === '' &&
  state.goalAmount === 0 &&
  state.initialSaved === 0 &&
  Object.keys(state.monthlySavings ?? {}).length === 0 &&
  state.expenses.every(isSeedExpense);

/**
 * Lê e normaliza o blob `finance-hub-state`. Devolve null quando não há nada
 * que valha a pena importar.
 *
 * As normalizações abaixo viviam num useEffect do App enquanto o localStorage
 * era a fonte da verdade. Agora que dado legado só entra por aqui, este é o
 * único ponto que precisa conhecê-las.
 */
export function readLegacyState(): FinanceState | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<FinanceState> | null;
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.expenses)) return null;

    // Valores de exemplo que o app antigo gravava e depois passou a limpar.
    const hasExampleGoal = parsed.goalName === 'Minha liberdade financeira' && parsed.goalAmount === 12000;
    const hasExampleSalary = parsed.salary === 5000;

    const expenses: Expense[] = parsed.expenses
      .filter((expense): expense is Expense => Boolean(expense) && typeof expense.id === 'string')
      .map((expense) => {
        // Reencaixa despesas salvas antes da taxonomia Categoria -> Subcategoria.
        const resolved = resolveCategory(expense.category, expense.subcategory);
        return {
          ...expense,
          amount: Number(expense.amount) || 0,
          category: resolved.category,
          subcategory: resolved.subcategory
        };
      });

    const state: FinanceState = {
      salary: hasExampleSalary ? 0 : Number(parsed.salary) || 0,
      savingsPercent: Number(parsed.savingsPercent) || 0,
      goalName: hasExampleGoal ? '' : (parsed.goalName ?? ''),
      goalAmount: hasExampleGoal ? 0 : Number(parsed.goalAmount) || 0,
      initialSaved: Number(parsed.initialSaved) || 0,
      monthlySavings: parsed.monthlySavings ?? {},
      expenses
    };

    return isUntouchedDemo(state) ? null : state;
  } catch {
    // localStorage bloqueado ou JSON corrompido: seguir sem importar é melhor
    // do que travar o login.
    return null;
  }
}

// Guarda o blob antigo em vez de apagar: se a importação tiver algum problema,
// o dado original ainda está no navegador.
export function archiveLegacyState(): void {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    window.localStorage.setItem(LEGACY_BACKUP_KEY, raw);
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Sem storage não há o que arquivar.
  }
}

// Importa o estado que vivia no localStorage. Ids antigos ('seed-market', ou o
// fallback `${Date.now()}-${random}`) não são uuid, então são remapeados —
// preservando o agrupamento das parcelas.
export async function importLocalState(userId: string, local: FinanceState): Promise<FinanceState> {
  const groupIdMap = new Map<string, string>();

  const remapGroupId = (groupId: string | undefined) => {
    if (!groupId) return undefined;
    if (isUuid(groupId)) return groupId;

    const existing = groupIdMap.get(groupId);
    if (existing) return existing;

    const next = uuid();
    groupIdMap.set(groupId, next);
    return next;
  };

  const expenses: Expense[] = local.expenses.map((expense) => ({
    ...expense,
    id: isUuid(expense.id) ? expense.id : uuid(),
    installmentGroupId: remapGroupId(expense.installmentGroupId)
  }));

  const settings: FinanceSettings = {
    salary: local.salary,
    savingsPercent: local.savingsPercent,
    goalName: local.goalName,
    goalAmount: local.goalAmount,
    initialSaved: local.initialSaved
  };

  await saveSettings(userId, settings);

  const savingsEntries = Object.entries(local.monthlySavings ?? {});
  if (savingsEntries.length) {
    const { error } = await supabase.from('monthly_savings').upsert(
      savingsEntries.map(([monthKey, amount]) => ({
        user_id: userId,
        month_key: monthKey,
        amount
      })),
      { onConflict: 'user_id,month_key' }
    );

    if (error) throw error;
  }

  await insertExpenses(userId, expenses);

  return { ...local, ...settings, expenses };
}
