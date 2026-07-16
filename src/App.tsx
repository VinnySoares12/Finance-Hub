import { useEffect, useMemo, useState } from 'react';
import { AccountMenu } from './components/AccountMenu';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { FinanceHero } from './components/FinanceHero';
import { MetricCard } from './components/MetricCard';
import { MoneyInput } from './components/MoneyInput';
import { MonthMenu } from './components/MonthMenu';
import { LanguageSelector } from './components/LanguageSelector';
import { useFinanceState } from './hooks/useFinanceState';
import { useI18n } from './i18n';
import { exportExpensesToExcel } from './utils/formatters';
import { uuid } from './utils/id';
import { getSubcategory } from './data/categories';
import type { CategoryKey, Expense, PaymentMethod, SubcategoryKey } from './types';

const now = new Date();
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const availableYears = Array.from({ length: 14 }, (_, index) => now.getFullYear() - 3 + index);

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
  const { locale, t, currency, percent, categoryLabel, subcategoryLabel } = useI18n();
  const [finance, setFinance, syncStatus] = useFinanceState();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false);
  const [goalDraftName, setGoalDraftName] = useState('');
  const [goalDraftAmount, setGoalDraftAmount] = useState(0);
  const [goalDraftInitialSaved, setGoalDraftInitialSaved] = useState(0);
  const [goalError, setGoalError] = useState('');

  // Os rascunhos da meta não podem mais ser semeados no useState inicial: o
  // estado agora chega do Supabase depois da primeira renderização.
  useEffect(() => {
    setGoalDraftName(finance.goalName ?? '');
    setGoalDraftAmount(finance.goalAmount ?? 0);
    setGoalDraftInitialSaved(finance.initialSaved ?? 0);
  }, [finance.goalName, finance.goalAmount, finance.initialSaved]);

  const months = useMemo(
    () => getMonthsForYear(Number(selectedMonth.slice(0, 4)), locale),
    [selectedMonth, locale]
  );
  const monthlySavings = finance.monthlySavings ?? {};
  const selectedMonthSaved = monthlySavings[selectedMonth] ?? 0;
  const selectedMonthLabel = months.find((month) => month.key === selectedMonth)?.label ?? '';

  const totalSaved = useMemo(
    () => (finance.initialSaved ?? 0) + Object.values(monthlySavings).reduce((sum, value) => sum + Math.max(value, 0), 0),
    [monthlySavings, finance.initialSaved]
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
      goalAmount: goalDraftAmount,
      initialSaved: goalDraftInitialSaved
    }));
    setGoalError('');
  };

  const handleDeleteGoal = () => {
    setFinance((current) => ({
      ...current,
      goalName: '',
      goalAmount: 0,
      initialSaved: 0
    }));
    setGoalDraftName('');
    setGoalDraftAmount(0);
    setGoalDraftInitialSaved(0);
    setGoalError('');
  };

  const handleAddExpense = (title: string, amount: number, category: CategoryKey, subcategory: SubcategoryKey, paymentMethod: PaymentMethod, installments: number, dueDate: string) => {
    const expensesToAdd: Expense[] = [];
    const installmentGroupId = uuid();

    if (paymentMethod === 'credit' && installments > 1) {
      const installmentAmount = amount / installments;

      const [currentYear, currentMonth] = selectedMonth.split('-').map(Number);
      let startMonth = currentMonth;
      let startYear = currentYear;

      if (dueDate) {
        const [dueYear, dueMonth] = dueDate.split('-').map(Number);
        startMonth = dueMonth;
        startYear = dueYear;
      } else {
        startMonth = currentMonth + 1;
        if (startMonth > 12) {
          startMonth -= 12;
          startYear += 1;
        }
      }

      for (let i = 0; i < installments; i++) {
        let targetMonth = startMonth + i;
        let targetYear = startYear;

        while (targetMonth > 12) {
          targetMonth -= 12;
          targetYear += 1;
        }

        const monthKey = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;

        const expense: Expense = {
          id: uuid(),
          title,
          amount: installmentAmount,
          category,
          subcategory,
          paymentMethod,
          installments: i === 0 ? installments : undefined,
          installmentGroupId,
          dueDate: dueDate ? dueDate : undefined,
          createdAt: `${monthKey}-01T12:00:00.000Z`
        };

        expensesToAdd.push(expense);
      }
    } else {
      const createdAtMonth = dueDate ? dueDate.slice(0, 7) : selectedMonth;

      const expense: Expense = {
        id: uuid(),
        title,
        amount,
        category,
        subcategory,
        paymentMethod,
        dueDate: dueDate ? dueDate : undefined,
        createdAt: `${createdAtMonth}-01T12:00:00.000Z`
      };

      expensesToAdd.push(expense);
    }

    setFinance((current) => ({
      ...current,
      expenses: [...expensesToAdd, ...current.expenses]
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

  const handleExportExpenses = () => {
    exportExpensesToExcel({
      expenses: selectedMonthExpenses,
      monthLabel: selectedMonthLabel,
      monthKey: selectedMonth,
      locale,
      labels: {
        reportTitle: t('expenseReport'),
        date: t('exportDate'),
        description: t('expenseName'),
        category: t('category'),
        amount: t('value'),
        total: t('exportTotal'),
        empty: t('noExpenses')
      },
      getCategoryLabel: (expense) => {
        const subcategory = getSubcategory(expense.category, expense.subcategory);
        return subcategory
          ? `${categoryLabel(expense.category)} • ${subcategoryLabel(expense.category, expense.subcategory)}`
          : categoryLabel(expense.category);
      }
    });
  };

  return (
    <>
      <MonthMenu
        isOpen={isMonthMenuOpen}
        months={months}
        years={availableYears}
        selectedMonth={selectedMonth}
        monthlySavings={monthlySavings}
        expenseCount={selectedMonthExpenses.length}
        onToggle={() => setIsMonthMenuOpen((current) => !current)}
        onClose={() => setIsMonthMenuOpen(false)}
        onSelectMonth={setSelectedMonth}
        onSelectYear={handleSelectYear}
        onExportExpenses={handleExportExpenses}
      />

      <main className="app-shell">
        <div className="top-bar">
          <AccountMenu syncStatus={syncStatus} />
          <LanguageSelector />
        </div>

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

                <label title={t('initialSavedHint')}>
                  {t('initialSaved')}
                  <MoneyInput
                    value={goalDraftInitialSaved}
                    onValueChange={setGoalDraftInitialSaved}
                    placeholder="Ex: 100000"
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
