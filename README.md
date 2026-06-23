# Finance Hub

Finance Hub é um projeto pessoal em **React + TypeScript** para controlar salário, reserva automática, gastos mensais e sobra disponível. A ideia é ser uma alternativa moderna a uma planilha de gastos pessoais, com interface tecnológica, responsiva e interativa.

## O que já vem pronto

- Campo para informar o salário atual.
- Controle de porcentagem que será guardada automaticamente.
- Cálculo automático do valor guardado.
- Cálculo automático das saídas/gastos.
- Cálculo automático da sobra mensal.
- Cadastro de gastos com nome, valor e categoria.
- Categorias com emojis: mercado, transporte, água, luz, internet, casa, lazer, saúde, educação e outros.
- Lista de gastos com botão de remover.
- Distribuição dos gastos por categoria.
- Dados salvos no navegador com `localStorage`.
- Interface responsiva para desktop e celular.
- Card 3D interativo com efeito de inclinação pelo mouse.
- Estrutura limpa para evoluir com Codex, Claude Code ou VS Code.

## Como rodar no VS Code

> Requisito recomendado: Node.js 20.19+.

```bash
npm install
npm run dev
```

Depois abra o endereço exibido no terminal, normalmente:

```bash
http://localhost:5173
```

## Scripts disponíveis

```bash
npm run dev       # inicia o ambiente local
npm run build     # valida TypeScript e gera build de produção
npm run preview   # pré-visualiza o build
npm run typecheck # roda apenas a checagem TypeScript
```

## Estrutura principal

```txt
finance-hub/
├─ src/
│  ├─ components/
│  │  ├─ CategoryBreakdown.tsx
│  │  ├─ ExpenseForm.tsx
│  │  ├─ ExpenseList.tsx
│  │  ├─ FinanceHero.tsx
│  │  └─ MetricCard.tsx
│  ├─ data/
│  │  └─ categories.ts
│  ├─ hooks/
│  │  └─ useLocalStorage.ts
│  ├─ utils/
│  │  └─ formatters.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ styles.css
│  └─ types.ts
├─ docs/
│  └─ CODEX_PROMPT.md
├─ package.json
└─ vite.config.ts
```

## Ideias para próximas versões

- Login de usuário.
- Metas financeiras por mês.
- Gráfico mensal de evolução.
- Exportar dados para CSV/Excel.
- Modo claro/escuro.
- Backend com banco de dados.
- Gastos fixos e variáveis.
- Controle por cartões, contas e bancos.
- Dashboard anual.

## Observação

Este projeto é privado/pessoal e não contém nenhuma regra ligada a trabalho ou empresa. Ele foi pensado para portfólio, GitHub, LinkedIn e uso real com amigos.
