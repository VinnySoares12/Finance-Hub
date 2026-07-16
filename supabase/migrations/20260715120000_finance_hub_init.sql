-- Finance Hub — estrutura inicial de dados e políticas de segurança.
--
-- Modelo de segurança:
--   * Toda tabela liga em auth.users e tem Row Level Security ativo.
--   * Todas as políticas são `to authenticated`, então a role `anon` (a chave
--     pública que vai no bundle do browser) não enxerga nem escreve nada.
--   * Todas as políticas comparam com (select auth.uid()), o que isola cada
--     usuário aos seus próprios dados no nível do banco — mesmo que alguém
--     chame a API REST direto, fora do app.
--
-- Rodar com:  supabase db push
-- Ou colar no SQL Editor do painel do Supabase.

-- ---------------------------------------------------------------------------
-- Utilitários
-- ---------------------------------------------------------------------------

-- `search_path = ''` é obrigatório em funções SECURITY DEFINER: sem isso um
-- usuário poderia criar um schema na frente do search_path e sequestrar os
-- nomes não qualificados usados aqui dentro.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — dados de exibição do usuário
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  language text not null default 'pt' check (language in ('pt', 'en', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- finance_settings — salário, meta e reserva (1 linha por usuário)
-- ---------------------------------------------------------------------------

create table if not exists public.finance_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  salary numeric(14, 2) not null default 0 check (salary >= 0),
  savings_percent smallint not null default 20 check (savings_percent between 0 and 100),
  goal_name text not null default '' check (char_length(goal_name) <= 42),
  goal_amount numeric(14, 2) not null default 0 check (goal_amount >= 0),
  initial_saved numeric(14, 2) not null default 0 check (initial_saved >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.finance_settings enable row level security;

create policy "finance_settings_select_own" on public.finance_settings
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "finance_settings_insert_own" on public.finance_settings
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "finance_settings_update_own" on public.finance_settings
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create trigger finance_settings_set_updated_at
  before update on public.finance_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- monthly_savings — quanto foi guardado em cada mês
-- ---------------------------------------------------------------------------

create table if not exists public.monthly_savings (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Mesmo formato "YYYY-MM" que o app usa como chave de mês.
  month_key text not null check (month_key ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  amount numeric(14, 2) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, month_key)
);

alter table public.monthly_savings enable row level security;

create policy "monthly_savings_select_own" on public.monthly_savings
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "monthly_savings_insert_own" on public.monthly_savings
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "monthly_savings_update_own" on public.monthly_savings
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "monthly_savings_delete_own" on public.monthly_savings
  for delete to authenticated using ((select auth.uid()) = user_id);

create trigger monthly_savings_set_updated_at
  before update on public.monthly_savings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- expenses — despesas
-- ---------------------------------------------------------------------------

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  amount numeric(14, 2) not null check (amount >= 0),
  category text not null check (char_length(category) between 1 and 60),
  subcategory text not null check (char_length(subcategory) between 1 and 60),
  payment_method text not null check (payment_method in ('cash', 'credit')),
  -- Preenchido apenas na primeira parcela de uma compra parcelada.
  installments smallint check (installments is null or installments between 1 and 60),
  -- Liga as parcelas de uma mesma compra.
  installment_group_id uuid,
  due_date date,
  -- O app usa created_at como mês de competência da despesa (e não como
  -- instante do registro), então quem envia o valor é o cliente.
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "expenses_select_own" on public.expenses
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "expenses_insert_own" on public.expenses
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "expenses_update_own" on public.expenses
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "expenses_delete_own" on public.expenses
  for delete to authenticated using ((select auth.uid()) = user_id);

-- O app sempre filtra as despesas do usuário por mês, em ordem decrescente.
create index if not exists expenses_user_created_at_idx
  on public.expenses (user_id, created_at desc);

create index if not exists expenses_installment_group_idx
  on public.expenses (user_id, installment_group_id)
  where installment_group_id is not null;

-- ---------------------------------------------------------------------------
-- Bootstrap: cria profile + finance_settings junto com o usuário
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;

  insert into public.finance_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
