-- Adiciona o italiano ('it') ao conjunto de idiomas aceitos em profiles.language.
--
-- O app nao grava esta coluna hoje (fica so' no default 'pt' da trigger de
-- bootstrap), entao esta migration nao corrige nenhum bug em producao — e
-- so' para a constraint nao rejeitar 'it' no dia em que alguma tela passar
-- a sincronizar o idioma escolhido com o perfil do usuario.
--
-- O nome da constraint segue a convencao padrao do Postgres para um CHECK
-- inline sem nome explicito: <tabela>_<coluna>_check.

alter table public.profiles
  drop constraint if exists profiles_language_check;

alter table public.profiles
  add constraint profiles_language_check check (language in ('pt', 'en', 'es', 'it'));
