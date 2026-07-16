import { useAuth } from '../auth/AuthProvider';
import { useI18n } from '../i18n';
import type { SyncStatus } from '../hooks/useFinanceState';

const syncLabelKeys: Record<SyncStatus, string> = {
  loading: 'syncLoading',
  ready: 'syncReady',
  saving: 'syncSaving',
  error: 'syncError'
};

export function AccountMenu({ syncStatus }: { syncStatus: SyncStatus }) {
  const { user, signOut } = useAuth();
  const { t } = useI18n();

  const displayName = (user?.user_metadata?.display_name as string | undefined)?.trim();
  const label = displayName || user?.email || '';
  const initial = label.slice(0, 1).toUpperCase();

  return (
    <div className="account-menu">
      <span className="account-avatar" aria-hidden="true">
        {initial}
      </span>

      <div className="account-identity">
        <strong title={user?.email ?? ''}>{label}</strong>
        <span className={`sync-badge sync-${syncStatus}`}>
          <i aria-hidden="true" />
          {t(syncLabelKeys[syncStatus])}
        </span>
      </div>

      <button type="button" className="account-signout" onClick={() => void signOut()}>
        {t('authSignOut')}
      </button>
    </div>
  );
}
