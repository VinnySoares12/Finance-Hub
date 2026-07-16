import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// Códigos estáveis em vez de mensagens prontas: quem traduz é a tela de login,
// que tem acesso ao i18n.
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'user_already_exists'
  | 'weak_password'
  | 'invalid_email'
  | 'rate_limited'
  | 'network'
  | 'unknown';

export type AuthResult = {
  error: AuthErrorCode | null;
  // signUp com confirmação de e-mail ativa não devolve sessão.
  needsEmailConfirmation?: boolean;
};

type AuthValue = {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  isRecoveringPassword: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthValue | null>(null);

const toErrorCode = (error: { code?: string; message?: string } | null): AuthErrorCode => {
  if (!error) return 'unknown';

  // SDKs recentes trazem `code`; a mensagem é o fallback para versões antigas.
  switch (error.code) {
    case 'invalid_credentials':
      return 'invalid_credentials';
    case 'email_not_confirmed':
      return 'email_not_confirmed';
    case 'user_already_exists':
    case 'email_exists':
      return 'user_already_exists';
    case 'weak_password':
      return 'weak_password';
    case 'validation_failed':
      return 'invalid_email';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'rate_limited';
    default:
      break;
  }

  const message = (error.message ?? '').toLowerCase();
  if (message.includes('invalid login credentials')) return 'invalid_credentials';
  if (message.includes('email not confirmed')) return 'email_not_confirmed';
  if (message.includes('already registered')) return 'user_already_exists';
  if (message.includes('password should be')) return 'weak_password';
  if (message.includes('rate limit') || message.includes('too many')) return 'rate_limited';
  if (message.includes('fetch') || message.includes('network')) return 'network';

  return 'unknown';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  useEffect(() => {
    let active = true;

    // Sessão restaurada do storage (ou trocada a partir do `?code=` de um link
    // de e-mail) antes de decidir o que renderizar.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setStatus(data.session ? 'authenticated' : 'unauthenticated');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;

      // A doc do Supabase alerta para não chamar outros métodos do client aqui
      // dentro: o callback roda com um lock e chamadas aninhadas travam.
      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'unauthenticated');

      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringPassword(true);
      }
      if (event === 'SIGNED_OUT') {
        setIsRecoveringPassword(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    return { error: error ? toErrorCode(error) : null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: displayName.trim() },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) return { error: toErrorCode(error) };

      // Com confirmação de e-mail ativa, cadastrar um e-mail já existente não
      // retorna erro (é proposital, para não vazar quais e-mails têm conta).
      // O sinal é a lista de identities vir vazia.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: 'user_already_exists' };
      }

      return { error: null, needsEmailConfirmation: !data.session };
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsRecoveringPassword(false);
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin
    });
    return { error: error ? toErrorCode(error) : null };
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: toErrorCode(error) };
    setIsRecoveringPassword(false);
    return { error: null };
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      isRecoveringPassword,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword
    }),
    [status, session, isRecoveringPassword, signIn, signUp, signOut, requestPasswordReset, updatePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
