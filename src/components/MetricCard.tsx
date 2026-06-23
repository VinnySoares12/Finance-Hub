import type { ReactNode } from 'react';
import { useI18n } from '../i18n';

type MetricCardProps = {
  label: string;
  value: number;
  eyebrow?: string;
  icon: ReactNode;
  tone?: 'positive' | 'negative' | 'neutral' | 'warning';
};

export function MetricCard({ label, value, eyebrow, icon, tone = 'neutral' }: MetricCardProps) {
  const { currency } = useI18n();
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-card__topline">
        <span className="metric-card__icon">{icon}</span>
        {eyebrow ? <span className="metric-card__eyebrow">{eyebrow}</span> : null}
      </div>
      <p>{label}</p>
      <strong>{currency(value)}</strong>
    </article>
  );
}
