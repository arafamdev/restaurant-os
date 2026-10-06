-- ============================================================
-- HELPER DE AUTORIZAÇÃO
-- ============================================================

-- Verifica se o utilizador autenticado é um Manager ativo.
--
-- SECURITY DEFINER permite que esta função consulte
-- employees e roles sem depender das policies dessas tabelas.

CREATE OR REPLACE FUNCTION public.is_current_user_restaurant_manager()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.employees e
    JOIN public.roles r
      ON r.id = e.role_id
    WHERE e.user_id = auth.uid()
      AND e.status = 'active'
      AND r.name = 'manager'
  );
$function$;


-- ============================================================
-- REMOVE POLICIES ANTIGAS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can view menu categories"
ON public.menu_categories;

DROP POLICY IF EXISTS "Authenticated users can delete menu items"
ON public.menu_items;

DROP POLICY IF EXISTS "Authenticated users can insert menu items"
ON public.menu_items;

DROP POLICY IF EXISTS "Authenticated users can select menu items"
ON public.menu_items;

DROP POLICY IF EXISTS "Authenticated users can update menu items"
ON public.menu_items;

DROP POLICY IF EXISTS "Authenticated users can view menu items"
ON public.menu_items;


-- Remove também as policies criadas anteriormente caso
-- esta migration seja reaplicada durante desenvolvimento.

DROP POLICY IF EXISTS "menu_categories_select_policy"
ON public.menu_categories;

DROP POLICY IF EXISTS "menu_categories_insert_policy"
ON public.menu_categories;

DROP POLICY IF EXISTS "menu_categories_update_policy"
ON public.menu_categories;

DROP POLICY IF EXISTS "menu_categories_delete_policy"
ON public.menu_categories;

DROP POLICY IF EXISTS "menu_items_select_policy"
ON public.menu_items;

DROP POLICY IF EXISTS "menu_items_insert_policy"
ON public.menu_items;

DROP POLICY IF EXISTS "menu_items_update_policy"
ON public.menu_items;

DROP POLICY IF EXISTS "menu_items_delete_policy"
ON public.menu_items;


-- ============================================================
-- MENU CATEGORIES
-- ============================================================

-- Platform Admin pode visualizar categorias de qualquer restaurante.
-- Manager pode visualizar apenas categorias do próprio restaurante.

CREATE POLICY "menu_categories_select_policy"
ON public.menu_categories
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Platform Admin pode criar categorias em qualquer restaurante.
-- Manager só pode criar categorias no próprio restaurante.

CREATE POLICY "menu_categories_insert_policy"
ON public.menu_categories
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Platform Admin pode editar qualquer categoria.
-- Manager só pode editar categorias do próprio restaurante.
--
-- O WITH CHECK impede que um Manager altere
-- o restaurant_id para outro restaurante.

CREATE POLICY "menu_categories_update_policy"
ON public.menu_categories
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Platform Admin pode eliminar qualquer categoria.
-- Manager só pode eliminar categorias do próprio restaurante.

CREATE POLICY "menu_categories_delete_policy"
ON public.menu_categories
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- ============================================================
-- MENU ITEMS
-- ============================================================

-- Platform Admin pode visualizar o menu de qualquer restaurante.
-- Manager pode visualizar apenas o menu do próprio restaurante.

CREATE POLICY "menu_items_select_policy"
ON public.menu_items
FOR SELECT
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Platform Admin pode criar itens para qualquer restaurante.
-- Manager só pode criar itens no próprio restaurante.

CREATE POLICY "menu_items_insert_policy"
ON public.menu_items
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Platform Admin pode editar qualquer item.
-- Manager só pode editar itens do próprio restaurante.
--
-- O WITH CHECK impede que um Manager altere
-- o restaurant_id para outro restaurante.

CREATE POLICY "menu_items_update_policy"
ON public.menu_items
FOR UPDATE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
)
WITH CHECK (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);


-- Platform Admin pode eliminar qualquer item.
-- Manager só pode eliminar itens do próprio restaurante.

CREATE POLICY "menu_items_delete_policy"
ON public.menu_items
FOR DELETE
TO authenticated
USING (
  public.is_current_user_platform_admin()
  OR (
    public.is_current_user_restaurant_manager()
    AND restaurant_id = public.get_current_user_restaurant_id()
  )
);