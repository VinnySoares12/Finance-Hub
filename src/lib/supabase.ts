import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Falha na inicialização em vez de deixar o app quebrar em cada query com um erro
// genérico de rede quando o .env.local não foi criado.
if (!url || !anonKey) {
  throw new Error(
    'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local (veja .env.example).'
  );
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // O fluxo PKCE evita que o token de acesso trafegue no fragmento da URL,
    // necessário para os links de recuperação de senha.
    flowType: 'pkce'
  }
});
