import App from './App';
import { useAuth } from './auth/AuthProvider';
import { LoginScreen } from './components/LoginScreen';
import { UpdatePasswordScreen } from './components/UpdatePasswordScreen';
import { useI18n } from './i18n';

function SplashScreen() {
  const { t } = useI18n();

  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <span className="auth-logo auth-logo-pulse" aria-hidden="true">
          💰
        </span>
        <h1>Finance Hub</h1>
        <p>{t('authRestoringSession')}</p>
      </div>
    </main>
  );
}

// Único ponto que decide o que o usuário vê: splash enquanto a sessão é
// restaurada do storage, senha nova quando ele chega por um link de
// recuperação, login quando não há sessão, e o app quando há.
export function AuthGate() {
  const { status, isRecoveringPassword } = useAuth();

  if (status === 'loading') return <SplashScreen />;
  if (isRecoveringPassword) return <UpdatePasswordScreen />;
  if (status === 'unauthenticated') return <LoginScreen />;

  return <App />;
}
