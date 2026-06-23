import type { Category, CategoryKey } from '../types';

export const categories: Category[] = [
  { key: 'market', label: 'Mercado', emoji: '🛒', gradient: 'from-emerald' },
  { key: 'transport', label: 'Uber / Transporte', emoji: '🚗', gradient: 'from-cyan' },
  { key: 'water', label: 'Água', emoji: '💧', gradient: 'from-blue' },
  { key: 'electricity', label: 'Luz', emoji: '⚡', gradient: 'from-amber' },
  { key: 'internet', label: 'Internet', emoji: '🌐', gradient: 'from-violet' },
  { key: 'housing', label: 'Casa / Aluguel', emoji: '🏠', gradient: 'from-rose' },
  { key: 'leisure', label: 'Lazer', emoji: '🎮', gradient: 'from-purple' },
  { key: 'health', label: 'Saúde', emoji: '🩺', gradient: 'from-lime' },
  { key: 'education', label: 'Educação', emoji: '📚', gradient: 'from-orange' },
  { key: 'other', label: 'Outros', emoji: '✨', gradient: 'from-slate' }
];

export const getCategory = (key: CategoryKey) =>
  categories.find((category) => category.key === key) ?? categories[categories.length - 1];
