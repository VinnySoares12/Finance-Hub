import { useEffect, useMemo, useState } from 'react';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { FinanceHero } from './components/FinanceHero';
import { MetricCard } from './components/MetricCard';
import { MoneyInput } from './components/MoneyInput';
import { MonthMenu } from './components/MonthMenu';
import { LanguageSelector } from './components/LanguageSelector';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useI18n } from './i18n';
import type { CategoryKey, Expense, FinanceState } from './types';

const now = new Date();
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const availableYears = Array.from({ length: 14 }, (_, index) => now.getFullYear() - 3 + index);

const initialFinanceState: FinanceState = {
  salary: 0,
  savingsPercent: 20,
  goalName: '',
  goalAmount: 0,
  monthlySavings: {},
  expenses: [
    {
      id: 'seed-market',
      title: 'Compras de mercado',
      amount: 620,
      category: 'market',
      createdAt: new Date().toISOString()
    },
    {
      id: 'seed-electricity',
      title: 'Conta de luz',
      amount: 180,
      category: 'electricity',
      createdAt: new Date().toISOString()
    },
    {
      id: 'seed-transport',
      title: 'Uber / transporte',
      amount: 300,
      category: 'transport',
      createdAt: new Date().toISOString()
    }
  ]
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getMonthsForYear = (year: number, locale: string) => (
  Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date(year, monthIndex, 1);

    return {
      key: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
    };
  })
);

function App() {
  const { locale, t, currency, percent } = useI18n();
  const [finance, setFinance] = useLocalStorage<FinanceState>('finance-hub-state', initialFinanceState);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false);
  const [goalDraftName, setGoalDraftName] = useState(finance.goalName ?? '');
  const [goalDraftAmount, setGoalDraftAmount] = useState(finance.goalAmount ?? 0);
  const [goalError, setGoalError] = useState('');

  useEffect(() => {
    setFinance((current) => {
      const hasLegacyExampleGoal =
        current.goalName === 'Minha liberdade financeira' && current.goalAmount === 12000;
      const needsMonthlySavings = !current.monthlySavings;
      const hasLegacyExampleSalary = current.salary === 5000;

      if (!hasLegacyExampleGoal && !needsMonthlySavings && !hasLegacyExampleSalary) return current;

      return {
        ...current,
        salary: hasLegacyExampleSalary ? 0 : current.salary,
        goalName: hasLegacyExampleGoal ? '' : current.goalName,
        goalAmount: hasLegacyExampleGoal ? 0 : current.goalAmount,
        monthlySavings: current.monthlySavings ?? {}
      };
    });
  }, [setFinance]);

  const months = useMemo(
    () => getMonthsForYear(Number(selectedMonth.slice(0, 4)), locale),
    [selectedMonth, locale]
  );
  const monthlySavings = finance.monthlySavings ?? {};
  const selectedMonthSaved = monthlySavings[selectedMonth] ?? 0;
  const selectedMonthLabel = months.find((month) => month.key === selectedMonth)?.label ?? '';

  const totalSaved = useMemo(
    () => Object.values(monthlySavings).reduce((sum, value) => sum + Math.max(value, 0), 0),
    [monthlySavings]
  );

  const selectedMonthExpenses = useMemo(
    () => finance.expenses.filter((expense) => expense.createdAt.slice(0, 7) === selectedMonth),
    [finance.expenses, selectedMonth]
  );

  const totalExpenses = useMemo(
    () => selectedMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [selectedMonthExpenses]
  );

  const plannedSavings = useMemo(
    () => Math.max(finance.salary * (finance.savingsPercent / 100), 0),
    [finance.salary, finance.savingsPercent]
  );

  const remainingAmount = useMemo(
    () => finance.salary - selectedMonthSaved - totalExpenses,
    [finance.salary, selectedMonthSaved, totalExpenses]
  );

  const handleSalaryChange = (value: number) => {
    setFinance((current) => ({ ...current, salary: value }));
  };

  const handleSavingsChange = (value: string) => {
    const nextValue = Math.min(Math.max(Number(value), 0), 100);
    setFinance((current) => ({ ...current, savingsPercent: nextValue }));
  };

  const handleMonthSavedChange = (value: number) => {
    setFinance((current) => ({
      ...current,
      monthlySavings: {
        ...(current.monthlySavings ?? {}),
        [selectedMonth]: value
      }
    }));
  };

  const handleSaveGoal = () => {
    const name = goalDraftName.trim();

    if (!name || goalDraftAmount <= 0) {
      setGoalError(t('goalError'));
      return;
    }

    setFinance((current) => ({
      ...current,
      goalName: name,
      goalAmount: goalDraftAmount
    }));
    setGoalError('');
  };

  const handleDeleteGoal = () => {
    setFinance((current) => ({
      ...current,
      goalName: '',
      goalAmount: 0
    }));
    setGoalDraftName('');
    setGoalDraftAmount(0);
    setGoalError('');
  };

  const handleAddExpense = (title: string, amount: number, category: CategoryKey) => {
    const expense: Expense = {
      id: generateId(),
      title,
      amount,
      category,
      createdAt: `${selectedMonth}-01T12:00:00.000Z`
    };

    setFinance((current) => ({
      ...current,
      expenses: [expense, ...current.expenses]
    }));
  };

  const handleRemoveExpense = (id: string) => {
    setFinance((current) => ({
      ...current,
      expenses: current.expenses.filter((expense) => expense.id !== id)
    }));
  };

  const handleReset = () => {
    setFinance((current) => {
      const nextMonthlySavings = { ...(current.monthlySavings ?? {}) };
      delete nextMonthlySavings[selectedMonth];

      return {
        ...current,
        monthlySavings: nextMonthlySavings,
        expenses: current.expenses.filter((expense) => expense.createdAt.slice(0, 7) !== selectedMonth)
      };
    });
  };

  const handleSelectYear = (year: number) => {
    const month = selectedMonth.slice(5, 7);
    setSelectedMonth(`${year}-${month}`);
  };

  return (
    <>
      <MonthMenu
        isOpen={isMonthMenuOpen}
        months={months}
        years={availableYears}
        selectedMonth={selectedMonth}
        monthlySavings={monthlySavings}
        onToggle={() => setIsMonthMenuOpen((current) => !current)}
        onClose={() => setIsMonthMenuOpen(false)}
        onSelectMonth={setSelectedMonth}
        onSelectYear={handleSelectYear}
      />

      <main className="app-shell">
        <LanguageSelector />

        <div className="selected-month-chip">
          <span>{t('selectedMonth')}</span>
          <strong>{selectedMonthLabel}</strong>
        </div>

        <FinanceHero
          plannedSavings={plannedSavings}
          selectedMonthSaved={selectedMonthSaved}
          totalSaved={totalSaved}
          goalName={finance.goalName ?? ''}
          goalAmount={finance.goalAmount ?? 0}
        />

        <section className="controls-grid">
          <div className="panel finance-controls">
            <div className="section-title">
              <span>⚙️</span>
              <div>
                <p>{t('planning', { month: selectedMonthLabel })}</p>
                <strong>{t('planResult')}</strong>
              </div>
            </div>

            <label>
              {t('salary')}
              <MoneyInput
                value={finance.salary}
                onValueChange={handleSalaryChange}
                placeholder="Ex: 5000"
              />
            </label>

            <label>
              {t('savingsIntent', { percent: percent(finance.savingsPercent) })}
              <input
                className="range-input"
                type="range"
                min="0"
                max="100"
                value={finance.savingsPercent}
                onChange={(event) => handleSavingsChange(event.target.value)}
              />
            </label>

            <div className="savings-plan">
              <div>
                <span>{t('plannedMonth')}</span>
                <strong>{currency(plannedSavings)}</strong>
              </div>
              <label>
                {t('actuallySaved')}
                <MoneyInput
                  value={selectedMonthSaved}
                  onValueChange={handleMonthSavedChange}
                  placeholder="Ex: 1000"
                />
              </label>
            </div>

            <div className="goal-editor">
              <div className="goal-fields">
                <label>
                  {t('personalGoal')}
                  <input
                    value={goalDraftName}
                    onChange={(event) => setGoalDraftName(event.target.value)}
                    placeholder={t('goalPlaceholder')}
                    maxLength={42}
                  />
                </label>

                <label>
                  {t('goalValue')}
                  <MoneyInput
                    value={goalDraftAmount}
                    onValueChange={setGoalDraftAmount}
                    placeholder="Ex: 20000"
                  />
                </label>
              </div>

              {goalError ? <p className="form-error goal-error">{goalError}</p> : null}

              <div className="goal-actions">
                <button className="goal-button" type="button" onClick={handleSaveGoal}>
                  {finance.goalName && finance.goalAmount > 0 ? t('updateGoal') : t('addGoal')}
                </button>

                {finance.goalName || finance.goalAmount > 0 ? (
                  <button className="goal-delete-button" type="button" onClick={handleDeleteGoal}>
                    {t('deleteGoal')}
                  </button>
                ) : null}
              </div>
            </div>

            <button className="ghost-button" type="button" onClick={handleReset}>
              {t('reset')}
            </button>
          </div>

          <ExpenseForm onAddExpense={handleAddExpense} />
        </section>

        <section className="metrics-grid" aria-label={t('summary')}>
          <MetricCard label={t('salaryMetric')} value={finance.salary} icon="💼" eyebrow={t('income')} tone="positive" />
          <MetricCard label={t('savedMonth')} value={selectedMonthSaved} icon="🏦" eyebrow={selectedMonthLabel} tone="neutral" />
          <MetricCard label={t('totalSaved')} value={totalSaved} icon="🎯" eyebrow={t('goal')} tone="positive" />
          <MetricCard
            label={t('remainingMonth')}
            value={remainingAmount}
            icon={remainingAmount >= 0 ? '🟢' : '🔴'}
            eyebrow={t('free')}
            tone={remainingAmount >= 0 ? 'positive' : 'negative'}
          />
        </section>

        <section className="content-grid">
          <ExpenseList expenses={selectedMonthExpenses} onRemoveExpense={handleRemoveExpense} />
          <CategoryBreakdown expenses={selectedMonthExpenses} totalExpenses={totalExpenses} />
        </section>

        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Finance Hub. {t('rights')}</span>
          <strong>{t('madeBy')}</strong>
        </footer>
      </main>
    </>
  );
}

export default App;
