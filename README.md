# Finance Hub

Finance Hub é uma aplicação web para organizar finanças pessoais de forma simples, visual e prática.

A ideia do projeto é facilitar o controle mensal de salário, reserva automática, gastos e saldo disponível, substituindo o uso de planilhas por uma interface mais moderna, responsiva e interativa.

---

## Objetivo do projeto

O objetivo do Finance Hub é ajudar no acompanhamento da vida financeira pessoal de maneira rápida e clara.

Com ele, é possível informar o salário mensal, definir uma porcentagem para guardar automaticamente, registrar despesas e visualizar quanto ainda sobra no mês.

O projeto foi pensado para ser simples no uso, mas com uma interface mais agradável e tecnológica, servindo tanto como ferramenta pessoal quanto como projeto de portfólio.

---

## Principais funcionalidades

* Controle de salário mensal.
* Definição automática de reserva financeira.
* Cálculo do valor guardado.
* Registro de despesas mensais.
* Cálculo automático dos gastos.
* Visualização da sobra disponível.
* Organização dos gastos por categoria.
* Conta pessoal com login por e-mail e senha.
* Dados salvos na nuvem e isolados por usuário, acessíveis de qualquer dispositivo.
* Interface responsiva para desktop e celular.
* Card interativo com efeito 3D baseado no movimento do mouse.

---

## Tecnologias utilizadas

* React
* TypeScript
* Vite
* CSS
* Supabase (autenticação e banco de dados)

---

## Configuração

### 1. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as credenciais do seu
projeto Supabase (painel > Project Settings > API):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

A chave `anon` é pública por natureza e vai no bundle do navegador — quem
protege os dados é o Row Level Security, não o sigilo dela. A chave
`service_role` nunca deve ser usada neste projeto: ela ignora o RLS.

### 2. Banco de dados

Aplique a migration em `supabase/migrations/` antes do primeiro uso, via
`supabase db push` ou colando o SQL no SQL Editor do painel.

### 3. Rodar

```bash
npm install
npm run dev
```
