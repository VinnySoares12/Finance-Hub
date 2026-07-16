import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useI18n } from '../i18n';
import { LanguageSelector } from './LanguageSelector';

const MIN_PASSWORD_LENGTH = 8;

// Exibida quando o usuário chega pelo link de recuperação: nesse ponto ele já
// tem sessão válida, mas ainda precisa definir a senha nova.
export function UpdatePasswordScreen() {
  const { t } = useI18n();
  const { updatePassword, signOut } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t('authPasswordTooShort', { min: MIN_PASSWORD_LENGTH }));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('authPasswordMismatch'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await updatePassword(password);
      if (result.error) {
        setError(t('authUnknown'));
      }
      // Em caso de sucesso o AuthProvider baixa a flag de recuperação e o app
      // segue direto para o dashboard, já autenticado.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <LanguageSelector />

      <div className="auth-brand">
        <span className="auth-logo" aria-hidden="true">
          🔑
        </span>
        <h1>Finance Hub</h1>
        <p>{t('authTagline')}</p>
      </div>

      <div className="panel auth-panel">
        <div className="section-title">
          <span aria-hidden="true">🔒</span>
          <div>
            <p>{t('authNewPasswordSubtitle')}</p>
            <strong>{t('authNewPasswordTitle')}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            {t('authNewPasswordLabel')}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('authPasswordPlaceholder')}
              autoComplete="new-password"
              autoFocus
            />
          </label>

          <label>
            {t('authConfirmPasswordLabel')}
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={t('authPasswordPlaceholder')}
              autoComplete="new-password"
            />
          </label>

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('authWorking') : t('authNewPasswordAction')}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" className="auth-link" onClick={() => void signOut()}>
            {t('authCancel')}
          </button>
        </div>
      </div>
    </main>
  );
}
