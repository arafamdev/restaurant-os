-- ============================================================
-- Restringe a leitura de funcionários à permission view_staff.
-- Platform Admin mantém acesso global.
-- ============================================================

DROP POLICY IF EXISTS "Users can view employees in their restaurant"
ON public.employees;

CREATE POLICY "Users can view employees in their restaurant"
ON public.employees
FOR SELECT
TO authenticated
USING (
  is_current_user_platform_admin()
  OR (
    restaurant_id = get_current_user_restaurant_id()
    AND has_permission('view_staff')
  )
);