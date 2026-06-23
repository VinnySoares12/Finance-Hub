# Prompt base para evoluir o Finance Hub no Codex

Você está trabalhando no projeto **Finance Hub**, um web app pessoal em React + TypeScript para controle de finanças pessoais.

## Objetivo do produto

Criar uma experiência mais moderna, intuitiva e interativa do que uma planilha comum de gastos pessoais. O usuário deve conseguir informar salário, definir uma porcentagem para guardar, cadastrar gastos e visualizar automaticamente quanto foi gasto, guardado e quanto sobrou.

## Regras de produto

- Manter a interface simples e fácil de usar.
- Evitar telas poluídas.
- Preservar os emojis por categoria.
- Manter os cálculos automáticos:
  - reserva = salário * porcentagem de reserva;
  - saídas = soma dos gastos;
  - sobra = salário - reserva - saídas.
- Evitar dependências desnecessárias.
- Priorizar componentes pequenos, reutilizáveis e bem tipados.
- Não misturar lógica financeira pesada dentro do CSS ou de componentes visuais.
- Preservar responsividade mobile.

## Stack atual

- React
- TypeScript
- Vite
- CSS puro
- localStorage

## Próximas melhorias recomendadas

1. Criar tela de metas financeiras.
2. Criar histórico por mês.
3. Adicionar gráficos de evolução.
4. Adicionar edição de gastos.
5. Adicionar gastos recorrentes.
6. Adicionar filtros por categoria.
7. Criar exportação CSV.
8. Criar modo claro/escuro.
9. Criar autenticação e backend futuramente.

## Estilo visual esperado

Visual tecnológico, limpo, atual, com sensação de dashboard premium. Usar glassmorphism, gradientes discretos, elementos 3D leves e animações suaves sem comprometer performance.
