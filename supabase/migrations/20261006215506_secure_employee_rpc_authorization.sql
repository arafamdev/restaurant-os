-- ============================================================
-- Protege os RPCs relacionados com funcionários.
--
-- Regras:
-- - Platform Admin tem acesso global.
-- - Outros funcionários precisam da permission correta.
-- - O acesso continua limitado ao próprio restaurante.
-- - As funções SECURITY DEFINER não devem ficar executáveis
--   por PUBLIC.
-- ============================================================


-- ============================================================
-- GET EMPLOYEE DETAILS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_employee_details(
  p_employee_id bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_is_platform_admin boolean;
  v_current_restaurant_id bigint;
  v_employee jsonb;
BEGIN
  -- Utilizador autenticado é obrigatório
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verifica se é Platform Admin
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_admins
    WHERE user_id = v_user_id
  )
  INTO v_is_platform_admin;

  -- Funcionários normais precisam de view_staff
  IF NOT v_is_platform_admin THEN

    IF NOT public.has_permission('view_staff') THEN
      RAISE EXCEPTION 'You do not have permission to view staff';
    END IF;

    SELECT e.restaurant_id
    INTO v_current_restaurant_id
    FROM public.employees e
    WHERE e.user_id = v_user_id
      AND e.status = 'active';

    IF v_current_restaurant_id IS NULL THEN
      RAISE EXCEPTION 'Active employee record not found';
    END IF;

  END IF;

  -- Procura o funcionário respeitando o tenant
  SELECT jsonb_build_object(
    'id', e.id,
    'user_id', e.user_id,
    'full_name', e.full_name,
    'email', au.email,
    'phone', e.phone,
    'status', e.status,
    'role_id', e.role_id,
    'role_name', r.name,
    'restaurant_id', e.restaurant_id,
    'restaurant_name', rest.name,
    'created_at', e.created_at
  )
  INTO v_employee
  FROM public.employees e
  JOIN public.roles r
    ON r.id = e.role_id
  JOIN public.restaurants rest
    ON rest.id = e.restaurant_id
  LEFT JOIN auth.users au
    ON au.id = e.user_id
  WHERE e.id = p_employee_id
    AND (
      v_is_platform_admin
      OR e.restaurant_id = v_current_restaurant_id
    );

  IF v_employee IS NULL THEN
    RAISE EXCEPTION 'Employee not found';
  END IF;

  RETURN v_employee;
END;
$function$;


-- ============================================================
-- CHANGE EMPLOYEE ROLE
-- ============================================================

CREATE OR REPLACE FUNCTION public.change_employee_role(
  p_employee_id bigint,
  p_role_id bigint
)
RETURNS public.employees
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_is_platform_admin boolean;
  v_current_employee public.employees%ROWTYPE;
  v_target_employee public.employees%ROWTYPE;
  v_new_role public.roles%ROWTYPE;
  v_active_manager_count integer;
BEGIN
  -- Utilizador autenticado é obrigatório
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Lock para evitar alterações simultâneas de cargos
  PERFORM pg_advisory_xact_lock(
    hashtext('restaurant_manager_role_change')
  );

  -- Verifica Platform Admin
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_admins
    WHERE user_id = v_user_id
  )
  INTO v_is_platform_admin;

  -- Obtém funcionário atual
  SELECT *
  INTO v_current_employee
  FROM public.employees
  WHERE user_id = v_user_id
    AND status = 'active';

  -- Funcionário normal precisa de change_employee_role
  IF NOT v_is_platform_admin THEN

    IF v_current_employee.id IS NULL THEN
      RAISE EXCEPTION 'Active employee record not found';
    END IF;

    IF NOT public.has_permission('change_employee_role') THEN
      RAISE EXCEPTION 'You do not have permission to change employee roles';
    END IF;

  END IF;

  -- Obtém funcionário alvo
  SELECT *
  INTO v_target_employee
  FROM public.employees
  WHERE id = p_employee_id;

  IF v_target_employee.id IS NULL THEN
    RAISE EXCEPTION 'Employee not found';
  END IF;

  -- Isolamento por restaurante
  IF NOT v_is_platform_admin THEN
    IF v_target_employee.restaurant_id <> v_current_employee.restaurant_id THEN
      RAISE EXCEPTION 'Employee belongs to another restaurant';
    END IF;
  END IF;

  -- Novo cargo precisa existir
  SELECT *
  INTO v_new_role
  FROM public.roles
  WHERE id = p_role_id;

  IF v_new_role.id IS NULL THEN
    RAISE EXCEPTION 'Role not found';
  END IF;

  -- Impede remover o último manager ativo
  IF v_target_employee.role_id = (
    SELECT id
    FROM public.roles
    WHERE name = 'manager'
  )
  AND v_new_role.name <> 'manager'
  AND v_target_employee.status = 'active'
  THEN

    SELECT count(*)
    INTO v_active_manager_count
    FROM public.employees e
    JOIN public.roles r
      ON r.id = e.role_id
    WHERE e.restaurant_id = v_target_employee.restaurant_id
      AND e.status = 'active'
      AND r.name = 'manager';

    IF v_active_manager_count <= 1 THEN
      RAISE EXCEPTION
        'Cannot remove the last active manager from a restaurant';
    END IF;

  END IF;

  -- Atualiza o cargo
  UPDATE public.employees
  SET role_id = p_role_id
  WHERE id = p_employee_id
  RETURNING *
  INTO v_target_employee;

  RETURN v_target_employee;
END;
$function$;


-- ============================================================
-- UPDATE EMPLOYEE STATUS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_employee_status(
  p_employee_id bigint,
  p_status text
)
RETURNS public.employees
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_is_platform_admin boolean;
  v_current_employee public.employees%ROWTYPE;
  v_target_employee public.employees%ROWTYPE;
  v_target_role public.roles%ROWTYPE;
  v_active_manager_count integer;
BEGIN
  -- Utilizador autenticado é obrigatório
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Apenas active/inactive são permitidos
  IF p_status NOT IN ('active', 'inactive') THEN
    RAISE EXCEPTION 'Invalid employee status';
  END IF;

  -- Verifica Platform Admin
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_admins
    WHERE user_id = v_user_id
  )
  INTO v_is_platform_admin;

  -- Obtém funcionário atual
  SELECT *
  INTO v_current_employee
  FROM public.employees
  WHERE user_id = v_user_id
    AND status = 'active';

  -- Funcionário normal precisa de manage_staff
  IF NOT v_is_platform_admin THEN

    IF v_current_employee.id IS NULL THEN
      RAISE EXCEPTION 'Active employee record not found';
    END IF;

    IF NOT public.has_permission('manage_staff') THEN
      RAISE EXCEPTION 'You do not have permission to manage staff';
    END IF;

  END IF;

  -- Obtém funcionário alvo
  SELECT *
  INTO v_target_employee
  FROM public.employees
  WHERE id = p_employee_id;

  IF v_target_employee.id IS NULL THEN
    RAISE EXCEPTION 'Employee not found';
  END IF;

  -- Isolamento por restaurante
  IF NOT v_is_platform_admin THEN
    IF v_target_employee.restaurant_id <> v_current_employee.restaurant_id THEN
      RAISE EXCEPTION 'Employee belongs to another restaurant';
    END IF;
  END IF;

  -- Obtém cargo do funcionário
  SELECT *
  INTO v_target_role
  FROM public.roles
  WHERE id = v_target_employee.role_id;

  IF v_target_role.id IS NULL THEN
    RAISE EXCEPTION 'Employee role not found';
  END IF;

  -- Impede desativar o último manager ativo
  IF p_status = 'inactive'
  AND v_target_employee.status = 'active'
  AND v_target_role.name = 'manager'
  THEN

    SELECT count(*)
    INTO v_active_manager_count
    FROM public.employees e
    JOIN public.roles r
      ON r.id = e.role_id
    WHERE e.restaurant_id = v_target_employee.restaurant_id
      AND e.status = 'active'
      AND r.name = 'manager';

    IF v_active_manager_count <= 1 THEN
      RAISE EXCEPTION
        'Cannot deactivate the last active manager of a restaurant';
    END IF;

  END IF;

  -- Atualiza o estado
  UPDATE public.employees
  SET status = p_status
  WHERE id = p_employee_id
  RETURNING *
  INTO v_target_employee;

  RETURN v_target_employee;
END;
$function$;


-- ============================================================
-- EXECUTE PRIVILEGES
-- ============================================================

-- As funções SECURITY DEFINER não devem ser executáveis por PUBLIC.
REVOKE EXECUTE
ON FUNCTION public.get_employee_details(bigint)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.change_employee_role(bigint, bigint)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.update_employee_status(bigint, text)
FROM PUBLIC;


-- Apenas utilizadores autenticados podem chamar os RPCs.
GRANT EXECUTE
ON FUNCTION public.get_employee_details(bigint)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.change_employee_role(bigint, bigint)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.update_employee_status(bigint, text)
TO authenticated;