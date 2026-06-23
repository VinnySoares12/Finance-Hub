import type { CSSProperties, MouseEvent } from 'react';
import { useI18n } from '../i18n';

type FinanceHeroProps = {
  plannedSavings: number;
  selectedMonthSaved: number;
  totalSaved: number;
  goalName: string;
  goalAmount: number;
};

type HeroStyle = CSSProperties & {
  '--rotate-x'?: string;
  '--rotate-y'?: string;
};

export function FinanceHero({
  plannedSavings,
  selectedMonthSaved,
  totalSaved,
  goalName,
  goalAmount
}: FinanceHeroProps) {
  const { locale, t, currency } = useI18n();
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateY = (((event.clientX - rect.left) / rect.width) - 0.5) * 16;
    const rotateX = (((event.clientY - rect.top) / rect.height) - 0.5) * -16;

    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const resetTilt = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--rotate-x', '0deg');
    event.currentTarget.style.setProperty('--rotate-y', '0deg');
  };

  const safeGoalAmount = Math.max(goalAmount, 0);
  const goalProgress = safeGoalAmount > 0
    ? Math.min((totalSaved / safeGoalAmount) * 100, 100)
    : 0;
  const remainingGoal = Math.max(safeGoalAmount - totalSaved, 0);
  const monthsToGoal = plannedSavings > 0 && remainingGoal > 0
    ? Math.ceil(remainingGoal / plannedSavings)
    : 0;
  const displayGoalName = goalName.trim() || t('defineAchievement');

  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <div className="badge">Finance Hub • Personal Money</div>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroText')}</p>
      </div>

      <div
        className="finance-3d-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        style={{ '--rotate-x': '0deg', '--rotate-y': '0deg' } as HeroStyle}
      >
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="finance-3d-card__glass">
          <div className="finance-3d-card__header">
            <span>{t('personalGoal')}</span>
            <strong>{goalProgress.toLocaleString(locale, { maximumFractionDigits: 0 })}%</strong>
          </div>

          <div className="goal-vault" aria-label={t('progressFor', { goal: displayGoalName })}>
            <div className="goal-vault__halo" />
            <div className="goal-vault__body">
              <div className="goal-vault__door">
                <span className="goal-vault__handle" />
                <span className="goal-vault__shine" />
              </div>
              <div
                className="goal-vault__fill"
                style={{ '--goal-progress': `${goalProgress > 0 ? Math.max(goalProgress, 7) : 0}%` } as CSSProperties}
              />
            </div>

            <div className="goal-vault__copy">
              <small>{t('nextAchievement')}</small>
              <strong>{displayGoalName}</strong>
              <span>{safeGoalAmount > 0 ? currency(safeGoalAmount) : t('chooseTarget')}</span>
            </div>
          </div>

          <div className="goal-summary">
            <div>
              <span>{t('totalSaved')}</span>
              <strong>{currency(totalSaved)}</strong>
            </div>
            <div>
              <span>{remainingGoal > 0 ? t('remainingGoal') : t('goalReached')}</span>
              <strong>{safeGoalAmount > 0 ? currency(remainingGoal) : '—'}</strong>
            </div>
          </div>

          <div className="goal-month-note">
            <span>{t('thisMonth')}: <strong>{currency(selectedMonthSaved)}</strong></span>
            {monthsToGoal > 0 ? (
              <span>
                {t('estimate')}: <strong>{monthsToGoal} {t(monthsToGoal === 1 ? 'month' : 'months')}</strong>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
