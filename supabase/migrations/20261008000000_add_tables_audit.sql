-- Adiciona informações de auditoria à tabela de mesas.
-- O utilizador responsável pela operação é determinado pelo PostgreSQL
-- através de auth.uid(), e não pelo frontend.

alter table public.tables
  add column created_by uuid,
  add column updated_at timestamptz,
  add column updated_by uuid;


-- Liga o utilizador que criou a mesa ao utilizador autenticado do Supabase.

alter table public.tables
  add constraint tables_created_by_fkey
  foreign key (created_by)
  references auth.users (id);


-- Liga o último utilizador que alterou a mesa ao utilizador autenticado.

alter table public.tables
  add constraint tables_updated_by_fkey
  foreign key (updated_by)
  references auth.users (id);


-- Regista automaticamente o utilizador autenticado que cria a mesa.

create or replace function public.set_table_created_by()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.created_by := auth.uid();

  return new;
end;
$$;


-- Regista automaticamente o utilizador autenticado que altera a mesa
-- e atualiza a data da última alteração.

create or replace function public.set_table_updated_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();

  return new;
end;
$$;


-- Executa a auditoria de criação antes do INSERT.

drop trigger if exists set_tables_created_by
on public.tables;

create trigger set_tables_created_by
before insert on public.tables
for each row
execute function public.set_table_created_by();


-- Executa a auditoria de alteração antes do UPDATE.

drop trigger if exists set_tables_updated_audit
on public.tables;

create trigger set_tables_updated_audit
before update on public.tables
for each row
execute function public.set_table_updated_audit();