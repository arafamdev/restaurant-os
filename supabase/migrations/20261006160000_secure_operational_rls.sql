-- ============================================================
-- Segurança RLS das tabelas operacionais
-- ============================================================
--
-- Regras:
--
-- 1. Platform Admin tem acesso total.
-- 2. Manager tem acesso às operações permitidas pelas suas
--    permissions, sempre limitado ao seu restaurante.
-- 3. Outros funcionários só podem executar operações para as
--    quais possuem permission.
-- 4. O restaurante é sempre determinado pelo funcionário
--    autenticado.
-- 5. A autorização usa has_permission() para respeitar tanto
--    permissions herdadas pelo role como permissions individuais.
-- ============================================================


-- ============================================================
-- CUSTOMERS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create customers"
ON public.customers;

DROP POLICY IF EXISTS "Authenticated users can delete customers"
ON public.customers;

DROP POLICY IF EXISTS "Authenticated users can update customers"
ON public.customers;

DROP POLICY IF EXISTS "Authenticated users can view customers"
ON public.customers;


-- Um utilizador só pode consultar clientes do seu restaurante
-- quando possui uma permission relacionada com operações que
-- trabalham diretamente com clientes.
CREATE POLICY "Users can view customers in their restaurant"
ON public.customers
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND (
      public.has_permission('manage_reservations')
      OR public.has_permission('create_orders')
      OR public.has_permission('manage_orders')
      OR public.has_permission('close_customer_account')
    )
  )
);


-- Criar clientes exige uma permission operacional que utilize
-- clientes.
CREATE POLICY "Users can create customers in their restaurant"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND (
      public.has_permission('manage_reservations')
      OR public.has_permission('create_orders')
      OR public.has_permission('manage_orders')
    )
  )
);


-- Atualizar clientes exige uma permission operacional adequada.
CREATE POLICY "Users can update customers in their restaurant"
ON public.customers
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND (
      public.has_permission('manage_reservations')
      OR public.has_permission('manage_orders')
      OR public.has_permission('close_customer_account')
    )
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND (
      public.has_permission('manage_reservations')
      OR public.has_permission('manage_orders')
      OR public.has_permission('close_customer_account')
    )
  )
);


-- A eliminação de um cliente é uma operação mais sensível.
-- Exige close_customer_account.
CREATE POLICY "Users can delete customers in their restaurant"
ON public.customers
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('close_customer_account')
  )
);


-- ============================================================
-- RESERVATIONS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create reservations"
ON public.reservations;

DROP POLICY IF EXISTS "Authenticated users can delete reservations"
ON public.reservations;

DROP POLICY IF EXISTS "Authenticated users can update reservations"
ON public.reservations;

DROP POLICY IF EXISTS "Authenticated users can view reservations"
ON public.reservations;


-- Consultar reservas.
CREATE POLICY "Users can view reservations in their restaurant"
ON public.reservations
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_reservations')
  )
);


-- Criar reservas.
CREATE POLICY "Users can create reservations in their restaurant"
ON public.reservations
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_reservations')
  )
);


-- Atualizar reservas.
CREATE POLICY "Users can update reservations in their restaurant"
ON public.reservations
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_reservations')
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_reservations')
  )
);


-- Eliminar reservas.
CREATE POLICY "Users can delete reservations in their restaurant"
ON public.reservations
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_reservations')
  )
);


-- ============================================================
-- TABLES
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create tables"
ON public.tables;

DROP POLICY IF EXISTS "Authenticated users can delete tables"
ON public.tables;

DROP POLICY IF EXISTS "Authenticated users can update tables"
ON public.tables;

DROP POLICY IF EXISTS "Authenticated users can view tables"
ON public.tables;


-- Consultar mesas.
CREATE POLICY "Users can view tables in their restaurant"
ON public.tables
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_tables')
  )
);


-- Criar mesas.
CREATE POLICY "Users can create tables in their restaurant"
ON public.tables
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_tables')
  )
);


-- Atualizar mesas.
CREATE POLICY "Users can update tables in their restaurant"
ON public.tables
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_tables')
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_tables')
  )
);


-- Eliminar mesas.
CREATE POLICY "Users can delete tables in their restaurant"
ON public.tables
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_tables')
  )
);


-- ============================================================
-- TABLE SESSIONS
-- ============================================================
--
-- Esta tabela não tinha policies.
-- Por isso, criamos explicitamente isolamento por restaurante.
-- ============================================================

CREATE POLICY "Users can view table sessions in their restaurant"
ON public.table_sessions
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND (
      public.has_permission('manage_tables')
      OR public.has_permission('create_orders')
      OR public.has_permission('manage_orders')
    )
  )
);


CREATE POLICY "Users can create table sessions in their restaurant"
ON public.table_sessions
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_tables')
  )
);


CREATE POLICY "Users can update table sessions in their restaurant"
ON public.table_sessions
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND (
      public.has_permission('manage_tables')
      OR public.has_permission('manage_orders')
    )
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND (
      public.has_permission('manage_tables')
      OR public.has_permission('manage_orders')
    )
  )
);


CREATE POLICY "Users can delete table sessions in their restaurant"
ON public.table_sessions
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_tables')
  )
);


-- ============================================================
-- DAILY MENUS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create daily menus"
ON public.daily_menus;

DROP POLICY IF EXISTS "Authenticated users can delete daily menus"
ON public.daily_menus;

DROP POLICY IF EXISTS "Authenticated users can update daily menus"
ON public.daily_menus;

DROP POLICY IF EXISTS "Authenticated users can view daily menus"
ON public.daily_menus;


-- Consultar Daily Menus.
CREATE POLICY "Users can view daily menus in their restaurant"
ON public.daily_menus
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Criar Daily Menus.
CREATE POLICY "Users can create daily menus in their restaurant"
ON public.daily_menus
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
);


-- Atualizar Daily Menus.
CREATE POLICY "Users can update daily menus in their restaurant"
ON public.daily_menus
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
);


-- Eliminar Daily Menus.
CREATE POLICY "Users can delete daily menus in their restaurant"
ON public.daily_menus
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
);


-- ============================================================
-- DAILY MENU OPTIONS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create daily menu options"
ON public.daily_menu_options;

DROP POLICY IF EXISTS "Authenticated users can delete daily menu options"
ON public.daily_menu_options;

DROP POLICY IF EXISTS "Authenticated users can update daily menu options"
ON public.daily_menu_options;

DROP POLICY IF EXISTS "Authenticated users can view daily menu options"
ON public.daily_menu_options;


-- Consultar opções dos Daily Menus.
CREATE POLICY "Users can view daily menu options in their restaurant"
ON public.daily_menu_options
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Criar opções.
CREATE POLICY "Users can create daily menu options in their restaurant"
ON public.daily_menu_options
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
);


-- Atualizar opções.
CREATE POLICY "Users can update daily menu options in their restaurant"
ON public.daily_menu_options
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
);


-- Eliminar opções.
CREATE POLICY "Users can delete daily menu options in their restaurant"
ON public.daily_menu_options
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('manage_menu')
  )
);


-- ============================================================
-- RESTAURANT DAYS
-- ============================================================

DROP POLICY IF EXISTS "Users can view restaurant days in their restaurant"
ON public.restaurant_days;


-- A consulta do Restaurant Day exige a permission específica.
-- Abrir e fechar continuam protegidos pelas RPCs existentes.
CREATE POLICY "Users can view restaurant days in their restaurant"
ON public.restaurant_days
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    restaurant_id = public.get_current_user_restaurant_id()
    AND public.has_permission('view_restaurant_day')
  )
);