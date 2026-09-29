
-- ============================================================
-- RestaurantOS
-- Migration: adicionar restaurant_id às tabelas específicas
-- de cada restaurante
-- ============================================================


-- ============================================================
-- 1. Adicionar restaurant_id às tabelas
-- ============================================================

ALTER TABLE public.employees
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.tables
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.customers
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.menu_categories
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.menu_items
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.daily_menus
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.reservations
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.restaurant_days
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.employee_permissions
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.daily_menu_options
ADD COLUMN restaurant_id bigint;

ALTER TABLE public.table_sessions
ADD COLUMN restaurant_id bigint;


-- ============================================================
-- 2. Associar os dados existentes ao restaurante Demo
--
-- Todos os dados que já existem pertencem atualmente ao:
-- RestaurantOS Demo Restaurant
-- restaurant_id = 1
-- ============================================================

UPDATE public.employees
SET restaurant_id = 1;

UPDATE public.tables
SET restaurant_id = 1;

UPDATE public.customers
SET restaurant_id = 1;

UPDATE public.menu_categories
SET restaurant_id = 1;

UPDATE public.daily_menus
SET restaurant_id = 1;

UPDATE public.restaurant_days
SET restaurant_id = 1;


-- Os itens do menu recebem o mesmo restaurante
-- da categoria à qual pertencem.

UPDATE public.menu_items mi
SET restaurant_id = mc.restaurant_id
FROM public.menu_categories mc
WHERE mc.id = mi.category_id;


-- As reservas recebem o mesmo restaurante
-- da mesa utilizada.

UPDATE public.reservations r
SET restaurant_id = t.restaurant_id
FROM public.tables t
WHERE t.id = r.table_id;


-- As permissões individuais recebem o mesmo restaurante
-- do funcionário.

UPDATE public.employee_permissions ep
SET restaurant_id = e.restaurant_id
FROM public.employees e
WHERE e.id = ep.employee_id;


-- As opções dos menus diários recebem o mesmo restaurante
-- do menu diário.

UPDATE public.daily_menu_options dmo
SET restaurant_id = dm.restaurant_id
FROM public.daily_menus dm
WHERE dm.id = dmo.daily_menu_id;


-- Atualmente não existem sessões de mesa.
-- Esta atualização fica preparada para futuros registos.

UPDATE public.table_sessions ts
SET restaurant_id = t.restaurant_id
FROM public.tables t
WHERE t.id = ts.table_id;


-- ============================================================
-- 3. Tornar restaurant_id obrigatório
--
-- Depois do backfill, nenhum registo pode ficar sem restaurante.
-- ============================================================

ALTER TABLE public.employees
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.tables
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.customers
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.menu_categories
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.menu_items
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.daily_menus
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.reservations
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.restaurant_days
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.employee_permissions
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.daily_menu_options
ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE public.table_sessions
ALTER COLUMN restaurant_id SET NOT NULL;


-- ============================================================
-- 4. Criar Foreign Keys para restaurants
--
-- Cada registo pertence obrigatoriamente a um restaurante
-- existente.
-- ============================================================

ALTER TABLE public.employees
ADD CONSTRAINT employees_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.tables
ADD CONSTRAINT tables_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.customers
ADD CONSTRAINT customers_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.menu_categories
ADD CONSTRAINT menu_categories_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.menu_items
ADD CONSTRAINT menu_items_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.daily_menus
ADD CONSTRAINT daily_menus_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.reservations
ADD CONSTRAINT reservations_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.restaurant_days
ADD CONSTRAINT restaurant_days_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.employee_permissions
ADD CONSTRAINT employee_permissions_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.daily_menu_options
ADD CONSTRAINT daily_menu_options_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;

ALTER TABLE public.table_sessions
ADD CONSTRAINT table_sessions_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES public.restaurants(id)
ON DELETE RESTRICT;


-- ============================================================
-- 5. Criar UNIQUE composto por restaurante
--
-- O id continua sendo único globalmente.
-- O UNIQUE (restaurant_id, id) permite criar Foreign Keys
-- compostas que garantem que as relações pertencem ao
-- mesmo restaurante.
-- ============================================================

ALTER TABLE public.employees
ADD CONSTRAINT employees_restaurant_id_id_key
UNIQUE (restaurant_id, id);

ALTER TABLE public.tables
ADD CONSTRAINT tables_restaurant_id_id_key
UNIQUE (restaurant_id, id);

ALTER TABLE public.customers
ADD CONSTRAINT customers_restaurant_id_id_key
UNIQUE (restaurant_id, id);

ALTER TABLE public.menu_categories
ADD CONSTRAINT menu_categories_restaurant_id_id_key
UNIQUE (restaurant_id, id);

ALTER TABLE public.menu_items
ADD CONSTRAINT menu_items_restaurant_id_id_key
UNIQUE (restaurant_id, id);

ALTER TABLE public.daily_menus
ADD CONSTRAINT daily_menus_restaurant_id_id_key
UNIQUE (restaurant_id, id);

ALTER TABLE public.reservations
ADD CONSTRAINT reservations_restaurant_id_id_key
UNIQUE (restaurant_id, id);

ALTER TABLE public.restaurant_days
ADD CONSTRAINT restaurant_days_restaurant_id_id_key
UNIQUE (restaurant_id, id);


-- ============================================================
-- 6. Corrigir UNIQUE que atualmente são globais
--
-- Estas regras precisam ser específicas por restaurante.
-- ============================================================

-- Uma mesa número 1 pode existir em vários restaurantes.
-- Mas não pode existir duas vezes no mesmo restaurante.

ALTER TABLE public.tables
DROP CONSTRAINT tables_table_number_key;

ALTER TABLE public.tables
ADD CONSTRAINT tables_restaurant_table_number_key
UNIQUE (restaurant_id, table_number);


-- Uma categoria "Bebidas" pode existir em vários restaurantes.
-- Mas não pode repetir dentro do mesmo restaurante.

ALTER TABLE public.menu_categories
DROP CONSTRAINT menu_categories_name_key;

ALTER TABLE public.menu_categories
ADD CONSTRAINT menu_categories_restaurant_name_key
UNIQUE (restaurant_id, name);


-- O mesmo dia pode existir para vários restaurantes.
-- Cada restaurante terá apenas um registo para cada data.

ALTER TABLE public.restaurant_days
DROP CONSTRAINT restaurant_days_business_date_key;

ALTER TABLE public.restaurant_days
ADD CONSTRAINT restaurant_days_restaurant_business_date_key
UNIQUE (restaurant_id, business_date);


-- Cada restaurante pode ter apenas um dia ativo
-- nos estados "open" ou "closing".

DROP INDEX IF EXISTS public.restaurant_days_one_active_day;

CREATE UNIQUE INDEX restaurant_days_one_active_day
ON public.restaurant_days (restaurant_id)
WHERE status IN ('open', 'closing');


-- ============================================================
-- 7. Substituir Foreign Keys por relações tenant-aware
--
-- Estas Foreign Keys compostas garantem que duas entidades
-- relacionadas pertencem ao mesmo restaurante.
-- ============================================================


-- ------------------------------------------------------------
-- menu_items → menu_categories
-- ------------------------------------------------------------

ALTER TABLE public.menu_items
DROP CONSTRAINT menu_items_category_id_fkey;

ALTER TABLE public.menu_items
ADD CONSTRAINT menu_items_category_same_restaurant_fkey
FOREIGN KEY (restaurant_id, category_id)
REFERENCES public.menu_categories(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- reservations → customers
-- ------------------------------------------------------------

ALTER TABLE public.reservations
DROP CONSTRAINT reservations_customer_id_fkey;

ALTER TABLE public.reservations
ADD CONSTRAINT reservations_customer_same_restaurant_fkey
FOREIGN KEY (restaurant_id, customer_id)
REFERENCES public.customers(restaurant_id, id)
ON DELETE CASCADE;


-- ------------------------------------------------------------
-- reservations → tables
-- ------------------------------------------------------------

ALTER TABLE public.reservations
DROP CONSTRAINT reservations_table_id_fkey;

ALTER TABLE public.reservations
ADD CONSTRAINT reservations_table_same_restaurant_fkey
FOREIGN KEY (restaurant_id, table_id)
REFERENCES public.tables(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- employee_permissions → employees
-- ------------------------------------------------------------

ALTER TABLE public.employee_permissions
DROP CONSTRAINT employee_permissions_employee_id_fkey;

ALTER TABLE public.employee_permissions
ADD CONSTRAINT employee_permissions_employee_same_restaurant_fkey
FOREIGN KEY (restaurant_id, employee_id)
REFERENCES public.employees(restaurant_id, id)
ON DELETE CASCADE;


-- ------------------------------------------------------------
-- employee_permissions.created_by → employees
-- ------------------------------------------------------------

ALTER TABLE public.employee_permissions
DROP CONSTRAINT employee_permissions_created_by_fkey;

ALTER TABLE public.employee_permissions
ADD CONSTRAINT employee_permissions_created_by_same_restaurant_fkey
FOREIGN KEY (restaurant_id, created_by)
REFERENCES public.employees(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- daily_menu_options → daily_menus
-- ------------------------------------------------------------

ALTER TABLE public.daily_menu_options
DROP CONSTRAINT daily_menu_options_daily_menu_id_fkey;

ALTER TABLE public.daily_menu_options
ADD CONSTRAINT daily_menu_options_daily_menu_same_restaurant_fkey
FOREIGN KEY (restaurant_id, daily_menu_id)
REFERENCES public.daily_menus(restaurant_id, id)
ON DELETE CASCADE;


-- ------------------------------------------------------------
-- daily_menu_options → menu_items
-- ------------------------------------------------------------

ALTER TABLE public.daily_menu_options
DROP CONSTRAINT daily_menu_options_menu_item_id_fkey;

ALTER TABLE public.daily_menu_options
ADD CONSTRAINT daily_menu_options_menu_item_same_restaurant_fkey
FOREIGN KEY (restaurant_id, menu_item_id)
REFERENCES public.menu_items(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- restaurant_days.opened_by → employees
-- ------------------------------------------------------------

ALTER TABLE public.restaurant_days
DROP CONSTRAINT restaurant_days_opened_by_fkey;

ALTER TABLE public.restaurant_days
ADD CONSTRAINT restaurant_days_opened_by_same_restaurant_fkey
FOREIGN KEY (restaurant_id, opened_by)
REFERENCES public.employees(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- restaurant_days.closed_by → employees
-- ------------------------------------------------------------

ALTER TABLE public.restaurant_days
DROP CONSTRAINT restaurant_days_closed_by_fkey;

ALTER TABLE public.restaurant_days
ADD CONSTRAINT restaurant_days_closed_by_same_restaurant_fkey
FOREIGN KEY (restaurant_id, closed_by)
REFERENCES public.employees(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- table_sessions → tables
-- ------------------------------------------------------------

ALTER TABLE public.table_sessions
DROP CONSTRAINT table_sessions_table_id_fkey;

ALTER TABLE public.table_sessions
ADD CONSTRAINT table_sessions_table_same_restaurant_fkey
FOREIGN KEY (restaurant_id, table_id)
REFERENCES public.tables(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- table_sessions → restaurant_days
-- ------------------------------------------------------------

ALTER TABLE public.table_sessions
DROP CONSTRAINT table_sessions_restaurant_day_id_fkey;

ALTER TABLE public.table_sessions
ADD CONSTRAINT table_sessions_restaurant_day_same_restaurant_fkey
FOREIGN KEY (restaurant_id, restaurant_day_id)
REFERENCES public.restaurant_days(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- table_sessions → reservations
-- ------------------------------------------------------------

ALTER TABLE public.table_sessions
DROP CONSTRAINT table_sessions_reservation_id_fkey;

ALTER TABLE public.table_sessions
ADD CONSTRAINT table_sessions_reservation_same_restaurant_fkey
FOREIGN KEY (restaurant_id, reservation_id)
REFERENCES public.reservations(restaurant_id, id)
ON DELETE SET NULL;


-- ------------------------------------------------------------
-- table_sessions.opened_by → employees
-- ------------------------------------------------------------

ALTER TABLE public.table_sessions
DROP CONSTRAINT table_sessions_opened_by_fkey;

ALTER TABLE public.table_sessions
ADD CONSTRAINT table_sessions_opened_by_same_restaurant_fkey
FOREIGN KEY (restaurant_id, opened_by)
REFERENCES public.employees(restaurant_id, id)
ON DELETE RESTRICT;


-- ------------------------------------------------------------
-- table_sessions.closed_by → employees
-- ------------------------------------------------------------

ALTER TABLE public.table_sessions
DROP CONSTRAINT table_sessions_closed_by_fkey;

ALTER TABLE public.table_sessions
ADD CONSTRAINT table_sessions_closed_by_same_restaurant_fkey
FOREIGN KEY (restaurant_id, closed_by)
REFERENCES public.employees(restaurant_id, id)
ON DELETE RESTRICT;


-- ============================================================
-- 8. Criar índices para restaurant_id
--
-- Estes índices serão importantes para performance e RLS.
-- ============================================================

CREATE INDEX employees_restaurant_id_idx
ON public.employees (restaurant_id);

CREATE INDEX tables_restaurant_id_idx
ON public.tables (restaurant_id);

CREATE INDEX customers_restaurant_id_idx
ON public.customers (restaurant_id);

CREATE INDEX menu_categories_restaurant_id_idx
ON public.menu_categories (restaurant_id);

CREATE INDEX menu_items_restaurant_id_idx
ON public.menu_items (restaurant_id);

CREATE INDEX daily_menus_restaurant_id_idx
ON public.daily_menus (restaurant_id);

CREATE INDEX reservations_restaurant_id_idx
ON public.reservations (restaurant_id);

CREATE INDEX restaurant_days_restaurant_id_idx
ON public.restaurant_days (restaurant_id);

CREATE INDEX employee_permissions_restaurant_id_idx
ON public.employee_permissions (restaurant_id);

CREATE INDEX daily_menu_options_restaurant_id_idx
ON public.daily_menu_options (restaurant_id);

CREATE INDEX table_sessions_restaurant_id_idx
ON public.table_sessions (restaurant_id);

