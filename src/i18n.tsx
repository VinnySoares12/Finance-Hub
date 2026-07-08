import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'es';

const locales: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES'
};

const messages: Record<Language, Record<string, string>> = {
  pt: {
    selectedMonth: 'Mês selecionado',
    planning: 'Planejamento de {month}',
    planResult: 'Plano e resultado do mês',
    salary: 'Salário atual',
    savingsIntent: 'Porcentagem que pretende guardar: {percent}',
    plannedMonth: 'Planejado para o mês',
    actuallySaved: 'Guardado de verdade',
    personalGoal: 'Minha meta pessoal',
    goalPlaceholder: 'Ex: Viagem, carro, reserva...',
    goalValue: 'Valor da meta',
    addGoal: 'Adicionar meta',
    updateGoal: 'Atualizar meta',
    deleteGoal: 'Apagar meta',
    initialSaved: 'Já tenho guardado',
    initialSavedHint: 'Valor que você já tinha antes de começar a usar o FinanceHub',
    goalError: 'Preencha o nome e um valor maior que zero.',
    reset: 'Limpar dados deste mês',
    selectYear: 'Selecionar ano',
    summary: 'Resumo financeiro',
    salaryMetric: 'Salário',
    income: 'Entrada',
    savedMonth: 'Guardado no mês',
    totalSaved: 'Total acumulado',
    goal: 'Meta',
    remainingMonth: 'Sobra no mês',
    free: 'Livre',
    history: 'Histórico',
    historyTitle: 'Quanto você guardou',
    registered: 'Registrado',
    notRegistered: 'Sem registro',
    openHistory: 'Abrir histórico mensal',
    closeHistory: 'Fechar histórico mensal',
    exportExpenses: 'Baixar despesas do mês',
    exportExpensesHint: '{count} despesa(s) no mês selecionado',
    expenseReport: 'Relatório de despesas',
    exportDate: 'Data',
    exportTotal: 'Total',
    closeMenu: 'Fechar menu',
    heroTitle: 'Seu dinheiro em movimento, mês após mês.',
    heroText: 'Registre quanto realmente conseguiu guardar e acompanhe o progresso acumulado até a sua próxima conquista.',
    nextAchievement: 'Próxima conquista',
    defineAchievement: 'Defina sua próxima conquista',
    chooseTarget: 'Escolha um valor-alvo',
    remainingGoal: 'Falta para a meta',
    goalReached: 'Meta alcançada',
    thisMonth: 'Este mês',
    estimate: 'Estimativa',
    months: 'meses',
    month: 'mês',
    progressFor: 'Progresso acumulado para {goal}',
    newExpense: 'Novo gasto',
    addMonthlyExpense: 'Cadastre uma saída mensal',
    expenseName: 'Nome do gasto',
    expensePlaceholder: 'Ex: Uber, mercado, água...',
    value: 'Valor',
    category: 'Categoria',
    addExpense: 'Adicionar gasto',
    expenseNameError: 'Digite o nome do gasto.',
    expenseValueError: 'Digite um valor maior que zero.',
    noExpenses: 'Nenhum gasto cadastrado ainda',
    noExpensesText: 'Adicione seus gastos do mês para ver a sobra atualizar automaticamente.',
    monthlyExpenses: 'Gastos do mês',
    itemsRegistered: '{count} item(ns) registrado(s)',
    remove: 'Remover',
    removeExpense: 'Remover {name}',
    categories: 'Categorias',
    moneyDestination: 'Onde seu dinheiro está indo',
    categoryEmpty: 'Cadastre gastos para visualizar a distribuição por categoria.',
    rights: 'Todos os direitos reservados.',
    madeBy: 'Feito por Vinicius Soares',
    'category.market': 'Mercado',
    'category.transport': 'Uber / Transporte',
    'category.water': 'Água',
    'category.electricity': 'Luz',
    'category.internet': 'Internet',
    'category.housing': 'Casa / Aluguel',
    'category.leisure': 'Lazer',
    'category.health': 'Saúde',
    'category.education': 'Educação',
    'category.card': 'Cartão',
    'category.gifts': 'Presentes',
    'category.other': 'Outros'
  },
  en: {
    selectedMonth: 'Selected month',
    planning: '{month} planning',
    planResult: 'Monthly plan and result',
    salary: 'Current salary',
    savingsIntent: 'Percentage you plan to save: {percent}',
    plannedMonth: 'Planned for the month',
    actuallySaved: 'Actually saved',
    personalGoal: 'My personal goal',
    goalPlaceholder: 'E.g. Trip, car, emergency fund...',
    goalValue: 'Goal amount',
    addGoal: 'Add goal',
    updateGoal: 'Update goal',
    deleteGoal: 'Delete goal',
    initialSaved: 'Already have saved',
    initialSavedHint: 'Amount you already had before starting to use FinanceHub',
    goalError: 'Enter a name and an amount greater than zero.',
    reset: 'Clear this month’s data',
    selectYear: 'Select year',
    summary: 'Financial summary',
    salaryMetric: 'Salary',
    income: 'Income',
    savedMonth: 'Saved this month',
    totalSaved: 'Total saved',
    goal: 'Goal',
    remainingMonth: 'Left this month',
    free: 'Available',
    history: 'History',
    historyTitle: 'How much you saved',
    registered: 'Recorded',
    notRegistered: 'No record',
    openHistory: 'Open monthly history',
    closeHistory: 'Close monthly history',
    exportExpenses: 'Download monthly expenses',
    exportExpensesHint: '{count} expense(s) in the selected month',
    expenseReport: 'Expense report',
    exportDate: 'Date',
    exportTotal: 'Total',
    closeMenu: 'Close menu',
    heroTitle: 'Your money in motion, month after month.',
    heroText: 'Record how much you actually saved and track your accumulated progress toward your next achievement.',
    nextAchievement: 'Next achievement',
    defineAchievement: 'Define your next achievement',
    chooseTarget: 'Choose a target amount',
    remainingGoal: 'Remaining to goal',
    goalReached: 'Goal reached',
    thisMonth: 'This month',
    estimate: 'Estimate',
    months: 'months',
    month: 'month',
    progressFor: 'Accumulated progress toward {goal}',
    newExpense: 'New expense',
    addMonthlyExpense: 'Add a monthly expense',
    expenseName: 'Expense name',
    expensePlaceholder: 'E.g. Uber, groceries, water...',
    value: 'Amount',
    category: 'Category',
    addExpense: 'Add expense',
    expenseNameError: 'Enter an expense name.',
    expenseValueError: 'Enter an amount greater than zero.',
    noExpenses: 'No expenses added yet',
    noExpensesText: 'Add your monthly expenses to see the available balance update automatically.',
    monthlyExpenses: 'Monthly expenses',
    itemsRegistered: '{count} item(s) recorded',
    remove: 'Remove',
    removeExpense: 'Remove {name}',
    categories: 'Categories',
    moneyDestination: 'Where your money is going',
    categoryEmpty: 'Add expenses to see the distribution by category.',
    rights: 'All rights reserved.',
    madeBy: 'Made by Vinicius Soares',
    'category.market': 'Groceries',
    'category.transport': 'Uber / Transport',
    'category.water': 'Water',
    'category.electricity': 'Electricity',
    'category.internet': 'Internet',
    'category.housing': 'Home / Rent',
    'category.leisure': 'Leisure',
    'category.health': 'Health',
    'category.education': 'Education',
    'category.card': 'Credit Card',
    'category.gifts': 'Gifts',
    'category.other': 'Other'
  },
  es: {
    selectedMonth: 'Mes seleccionado',
    planning: 'Planificación de {month}',
    planResult: 'Plan y resultado del mes',
    salary: 'Salario actual',
    savingsIntent: 'Porcentaje que planeas ahorrar: {percent}',
    plannedMonth: 'Planificado para el mes',
    actuallySaved: 'Ahorrado realmente',
    personalGoal: 'Mi meta personal',
    goalPlaceholder: 'Ej: Viaje, auto, fondo de emergencia...',
    goalValue: 'Valor de la meta',
    addGoal: 'Agregar meta',
    updateGoal: 'Actualizar meta',
    deleteGoal: 'Eliminar meta',
    initialSaved: 'Ya tengo ahorrado',
    initialSavedHint: 'Monto que ya tenías antes de empezar a usar FinanceHub',
    goalError: 'Escribe un nombre y un valor mayor que cero.',
    reset: 'Borrar los datos de este mes',
    selectYear: 'Seleccionar año',
    summary: 'Resumen financiero',
    salaryMetric: 'Salario',
    income: 'Ingreso',
    savedMonth: 'Ahorrado este mes',
    totalSaved: 'Total acumulado',
    goal: 'Meta',
    remainingMonth: 'Sobra del mes',
    free: 'Disponible',
    history: 'Historial',
    historyTitle: 'Cuánto ahorraste',
    registered: 'Registrado',
    notRegistered: 'Sin registro',
    openHistory: 'Abrir historial mensual',
    closeHistory: 'Cerrar historial mensual',
    exportExpenses: 'Descargar gastos del mes',
    exportExpensesHint: '{count} gasto(s) en el mes seleccionado',
    expenseReport: 'Informe de gastos',
    exportDate: 'Fecha',
    exportTotal: 'Total',
    closeMenu: 'Cerrar menú',
    heroTitle: 'Tu dinero en movimiento, mes a mes.',
    heroText: 'Registra cuánto lograste ahorrar realmente y sigue el progreso acumulado hacia tu próxima conquista.',
    nextAchievement: 'Próxima conquista',
    defineAchievement: 'Define tu próxima conquista',
    chooseTarget: 'Elige un valor objetivo',
    remainingGoal: 'Falta para la meta',
    goalReached: 'Meta alcanzada',
    thisMonth: 'Este mes',
    estimate: 'Estimación',
    months: 'meses',
    month: 'mes',
    progressFor: 'Progreso acumulado hacia {goal}',
    newExpense: 'Nuevo gasto',
    addMonthlyExpense: 'Registra un gasto mensual',
    expenseName: 'Nombre del gasto',
    expensePlaceholder: 'Ej: Uber, mercado, agua...',
    value: 'Valor',
    category: 'Categoría',
    addExpense: 'Agregar gasto',
    expenseNameError: 'Escribe el nombre del gasto.',
    expenseValueError: 'Escribe un valor mayor que cero.',
    noExpenses: 'Aún no hay gastos registrados',
    noExpensesText: 'Agrega tus gastos del mes para actualizar automáticamente el saldo disponible.',
    monthlyExpenses: 'Gastos del mes',
    itemsRegistered: '{count} elemento(s) registrado(s)',
    remove: 'Eliminar',
    removeExpense: 'Eliminar {name}',
    categories: 'Categorías',
    moneyDestination: 'A dónde va tu dinero',
    categoryEmpty: 'Registra gastos para ver la distribución por categoría.',
    rights: 'Todos los derechos reservados.',
    madeBy: 'Hecho por Vinicius Soares',
    'category.market': 'Mercado',
    'category.transport': 'Uber / Transporte',
    'category.water': 'Agua',
    'category.electricity': 'Electricidad',
    'category.internet': 'Internet',
    'category.housing': 'Casa / Alquiler',
    'category.leisure': 'Ocio',
    'category.health': 'Salud',
    'category.education': 'Educación',
    'category.card': 'Tarjeta',
    'category.gifts': 'Regalos',
    'category.other': 'Otros'
  }
};

type I18nValue = {
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  currency: (value: number) => string;
  percent: (value: number) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem('finance-hub-language');
    return saved === 'en' || saved === 'es' ? saved : 'pt';
  });

  useEffect(() => {
    window.localStorage.setItem('finance-hub-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nValue>(() => {
    const locale = locales[language];
    const t = (key: string, values: Record<string, string | number> = {}) => {
      let text = messages[language][key] ?? messages.pt[key] ?? key;
      Object.entries(values).forEach(([name, replacement]) => {
        text = text.replace(`{${name}}`, String(replacement));
      });
      return text;
    };

    return {
      language,
      locale,
      setLanguage,
      t,
      currency: (amount) => new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'BRL',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 2
      }).format(amount || 0),
      percent: (amount) => new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 1
      }).format((amount || 0) / 100)
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
