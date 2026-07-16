import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { AuthErrorCode } from '../auth/AuthProvider';
import { useI18n } from '../i18n';
import { LanguageSelector } from './LanguageSelector';

type Mode = 'signin' | 'signup' | 'reset';

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const errorKeys: Record<AuthErrorCode, string> = {
  invalid_credentials: 'authInvalidCredentials',
  email_not_confirmed: 'authEmailNotConfirmed',
  user_already_exists: 'authUserExists',
  weak_password: 'authWeakPassword',
  invalid_email: 'authInvalidEmail',
  rate_limited: 'authRateLimited',
  network: 'authNetwork',
  unknown: 'authUnknown'
};

export function LoginScreen() {
  const { t } = useI18n();
  const { signIn, signUp, requestPasswordReset } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
    setPassword('');
    setConfirmPassword('');
  };

  const validate = () => {
    if (!EMAIL_PATTERN.test(email.trim())) return t('authInvalidEmail');
    if (mode === 'reset') return '';
    if (mode === 'signup' && !displayName.trim()) return t('authNameRequired');
    if (!password) return t('authPasswordRequired');
    if (mode === 'signup') {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return t('authPasswordTooShort', { min: MIN_PASSWORD_LENGTH });
      }
      if (password !== confirmPassword) return t('authPasswordMismatch');
    }
    return '';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setNotice('');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (mode === 'reset') {
        const result = await requestPasswordReset(email);
        if (result.error) {
          setError(t(errorKeys[result.error]));
          return;
        }
        setNotice(t('authResetSent', { email: email.trim() }));
        return;
      }

      if (mode === 'signup') {
        const result = await signUp(email, password, displayName);
        if (result.error) {
          setError(t(errorKeys[result.error]));
          return;
        }
        if (result.needsEmailConfirmation) {
          setNotice(t('authCheckEmail', { email: email.trim() }));
          setPassword('');
          setConfirmPassword('');
        }
        // Sem confirmação de e-mail a sessão já existe e o AuthProvider troca
        // a tela sozinho — nada a fazer aqui.
        return;
      }

      const result = await signIn(email, password);
      if (result.error) {
        setError(t(errorKeys[result.error]));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const titles: Record<Mode, string> = {
    signin: t('authSignInTitle'),
    signup: t('authSignUpTitle'),
    reset: t('authResetTitle')
  };

  const subtitles: Record<Mode, string> = {
    signin: t('authSignInSubtitle'),
    signup: t('authSignUpSubtitle'),
    reset: t('authResetSubtitle')
  };

  const actions: Record<Mode, string> = {
    signin: t('authSignInAction'),
    signup: t('authSignUpAction'),
    reset: t('authResetAction')
  };

  return (
    <main className="auth-shell">
      <LanguageSelector />

      <div className="auth-brand">
        <span className="auth-logo" aria-hidden="true">
          💰
        </span>
        <h1>Finance Hub</h1>
        <p>{t('authTagline')}</p>
      </div>

      <div className="panel auth-panel">
        <div className="section-title">
          <span aria-hidden="true">{mode === 'reset' ? '🔑' : '🔒'}</span>
          <div>
            <p>{subtitles[mode]}</p>
            <strong>{titles[mode]}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'signup' ? (
            <label>
              {t('authNameLabel')}
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                maxLength={80}
              />
            </label>
          ) : null}

          <label>
            {t('authEmailLabel')}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('authEmailPlaceholder')}
              autoComplete="email"
              autoFocus
            />
          </label>

          {mode !== 'reset' ? (
            <label>
              {t('authPasswordLabel')}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('authPasswordPlaceholder')}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </label>
          ) : null}

          {mode === 'signup' ? (
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
          ) : null}

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="form-notice" role="status">
              {notice}
            </p>
          ) : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('authWorking') : actions[mode]}
          </button>
        </form>

        <div className="auth-links">
          {mode === 'signin' ? (
            <>
              <button type="button" className="auth-link" onClick={() => switchMode('reset')}>
                {t('authForgotPassword')}
              </button>
              <button type="button" className="auth-link" onClick={() => switchMode('signup')}>
                {t('authToSignUp')}
              </button>
            </>
          ) : (
            <button type="button" className="auth-link" onClick={() => switchMode('signin')}>
              {t('authToSignIn')}
            </button>
          )}
        </div>
      </div>

      <p className="auth-footnote">{t('authPrivacyNote')}</p>
    </main>
  );
}
