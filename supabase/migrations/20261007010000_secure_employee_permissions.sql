-- ============================================================
-- EMPLOYEE PERMISSIONS
-- Segurança e gestão de permissões individuais
-- ============================================================

-- ------------------------------------------------------------
-- 1. Garantir RLS
-- ------------------------------------------------------------

ALTER TABLE public.employee_permissions
  ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- 2. Remover policies antigas, caso existam
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "employee_permissions_select"
ON public.employee_permissions;

DROP POLICY IF EXISTS "employee_permissions_insert"
ON public.employee_permissions;

DROP POLICY IF EXISTS "employee_permissions_delete"
ON public.employee_permissions;


-- ------------------------------------------------------------
-- 3. Policies
--
-- A autorização utiliza:
--
-- Platform Admin
--   → acesso global
--
-- Utilizador com manage_employee_permissions
--   → apenas no próprio restaurante
--
-- A função has_permission() já considera:
--   - permissões do role
--   - permissões individuais
-- ------------------------------------------------------------

CREATE POLICY "employee_permissions_select"
ON public.employee_permissions
FOR SELECT
TO authenticated
USING (
  (select public.is_current_user_platform_admin())
  OR (
    restaurant_id = (select public.get_current_user_restaurant_id())
    AND (select public.has_permission('manage_employee_permissions'))
  )
);


CREATE POLICY "employee_permissions_insert"
ON public.employee_permissions
FOR INSERT
TO authenticated
WITH CHECK (
  (
    (select public.is_current_user_platform_admin())
    AND restaurant_id IS NOT NULL
  )
  OR (
    restaurant_id = (select public.get_current_user_restaurant_id())
    AND (select public.has_permission('manage_employee_permissions'))
    AND (
      created_by IS NULL
      OR created_by = (
        select e.id
        from public.employees e
        where e.user_id = (select auth.uid())
          and e.status = 'active'
        limit 1
      )
    )
  )
);


CREATE POLICY "employee_permissions_delete"
ON public.employee_permissions
FOR DELETE
TO authenticated
USING (
  (select public.is_current_user_platform_admin())
  OR (
    restaurant_id = (select public.get_current_user_restaurant_id())
    AND (select public.has_permission('manage_employee_permissions'))
  )
);


-- ------------------------------------------------------------
-- 4. Consultar permissões individuais de um funcionário
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_employee_permissions(
  p_employee_id bigint
)
RETURNS TABLE (
  id bigint,
  permission_id bigint,
  permission_name text,
  created_at timestamptz,
  created_by bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_employee_restaurant_id bigint;
BEGIN

  -- Verifica se o utilizador está autenticado.
  IF (select auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'Utilizador não autenticado';
  END IF;


  -- O utilizador precisa de gerir permissões.
  IF NOT (
    (select public.is_current_user_platform_admin())
    OR (select public.has_permission('manage_employee_permissions'))
  ) THEN
    RAISE EXCEPTION 'Sem permissão para gerir permissões de funcionários';
  END IF;


  -- Procura o restaurante do funcionário.
  SELECT e.restaurant_id
  INTO v_employee_restaurant_id
  FROM public.employees e
  WHERE e.id = p_employee_id;


  IF v_employee_restaurant_id IS NULL THEN
    RAISE EXCEPTION 'Funcionário não encontrado';
  END IF;


  -- Garante isolamento por restaurante.
  IF NOT (select public.is_current_user_platform_admin()) THEN
    IF v_employee_restaurant_id <>
       (select public.get_current_user_restaurant_id()) THEN
      RAISE EXCEPTION 'Funcionário pertence a outro restaurante';
    END IF;
  END IF;


  RETURN QUERY
  SELECT
    ep.id,
    ep.permission_id,
    p.name,
    ep.created_at,
    ep.created_by
  FROM public.employee_permissions ep
  JOIN public.permissions p
    ON p.id = ep.permission_id
  WHERE ep.employee_id = p_employee_id
  ORDER BY p.id;

END;
$function$;


-- ------------------------------------------------------------
-- 5. Adicionar permissão individual
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.grant_employee_permission(
  p_employee_id bigint,
  p_permission_id bigint
)
RETURNS public.employee_permissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_employee_restaurant_id bigint;
  v_current_employee_id bigint;
  v_result public.employee_permissions;
BEGIN

  -- Verifica autenticação.
  IF (select auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'Utilizador não autenticado';
  END IF;


  -- Verifica autorização.
  IF NOT (
    (select public.is_current_user_platform_admin())
    OR (select public.has_permission('manage_employee_permissions'))
  ) THEN
    RAISE EXCEPTION 'Sem permissão para gerir permissões de funcionários';
  END IF;


  -- Verifica o funcionário.
  SELECT e.restaurant_id
  INTO v_employee_restaurant_id
  FROM public.employees e
  WHERE e.id = p_employee_id
    AND e.status = 'active';


  IF v_employee_restaurant_id IS NULL THEN
    RAISE EXCEPTION 'Funcionário não encontrado ou inativo';
  END IF;


  -- Garante isolamento por restaurante.
  IF NOT (select public.is_current_user_platform_admin()) THEN
    IF v_employee_restaurant_id <>
       (select public.get_current_user_restaurant_id()) THEN
      RAISE EXCEPTION 'Funcionário pertence a outro restaurante';
    END IF;
  END IF;


  -- Verifica se a permissão existe.
  IF NOT EXISTS (
    SELECT 1
    FROM public.permissions p
    WHERE p.id = p_permission_id
  ) THEN
    RAISE EXCEPTION 'Permissão não encontrada';
  END IF;


  -- Obtém o employee_id do utilizador atual.
  SELECT e.id
  INTO v_current_employee_id
  FROM public.employees e
  WHERE e.user_id = (select auth.uid())
    AND e.status = 'active'
  LIMIT 1;


  -- Platform Admin não é employee.
  -- Nesse caso created_by permanece NULL.
  INSERT INTO public.employee_permissions (
    employee_id,
    permission_id,
    created_by,
    restaurant_id
  )
  VALUES (
    p_employee_id,
    p_permission_id,
    v_current_employee_id,
    v_employee_restaurant_id
  )
  ON CONFLICT (employee_id, permission_id)
  DO NOTHING
  RETURNING * INTO v_result;


  -- Se a permissão já existia, devolve o registro existente.
  IF v_result.id IS NULL THEN
    SELECT *
    INTO v_result
    FROM public.employee_permissions ep
    WHERE ep.employee_id = p_employee_id
      AND ep.permission_id = p_permission_id;
  END IF;


  RETURN v_result;

END;
$function$;


-- ------------------------------------------------------------
-- 6. Remover permissão individual
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.revoke_employee_permission(
  p_employee_id bigint,
  p_permission_id bigint
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_employee_restaurant_id bigint;
  v_deleted boolean;
BEGIN

  -- Verifica autenticação.
  IF (select auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'Utilizador não autenticado';
  END IF;


  -- Verifica autorização.
  IF NOT (
    (select public.is_current_user_platform_admin())
    OR (select public.has_permission('manage_employee_permissions'))
  ) THEN
    RAISE EXCEPTION 'Sem permissão para gerir permissões de funcionários';
  END IF;


  -- Verifica o funcionário.
  SELECT e.restaurant_id
  INTO v_employee_restaurant_id
  FROM public.employees e
  WHERE e.id = p_employee_id;


  IF v_employee_restaurant_id IS NULL THEN
    RAISE EXCEPTION 'Funcionário não encontrado';
  END IF;


  -- Garante isolamento por restaurante.
  IF NOT (select public.is_current_user_platform_admin()) THEN
    IF v_employee_restaurant_id <>
       (select public.get_current_user_restaurant_id()) THEN
      RAISE EXCEPTION 'Funcionário pertence a outro restaurante';
    END IF;
  END IF;


  DELETE FROM public.employee_permissions
  WHERE employee_id = p_employee_id
    AND permission_id = p_permission_id;


  v_deleted := FOUND;

  RETURN v_deleted;

END;
$function$;


-- ------------------------------------------------------------
-- 7. Consultar permissões efetivas
--
-- Combina:
--   - permissões provenientes do role
--   - permissões individuais
--
-- Cada permission aparece apenas uma vez.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_employee_effective_permissions(
  p_employee_id bigint
)
RETURNS TABLE (
  permission_id bigint,
  permission_name text,
  source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_employee_restaurant_id bigint;
BEGIN

  -- Verifica autenticação.
  IF (select auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'Utilizador não autenticado';
  END IF;


  -- Só quem pode gerir permissões pode consultar permissões de funcionários.
  IF NOT (
    (select public.is_current_user_platform_admin())
    OR (select public.has_permission('manage_employee_permissions'))
  ) THEN
    RAISE EXCEPTION 'Sem permissão para consultar permissões de funcionários';
  END IF;


  SELECT e.restaurant_id
  INTO v_employee_restaurant_id
  FROM public.employees e
  WHERE e.id = p_employee_id;


  IF v_employee_restaurant_id IS NULL THEN
    RAISE EXCEPTION 'Funcionário não encontrado';
  END IF;


  IF NOT (select public.is_current_user_platform_admin()) THEN
    IF v_employee_restaurant_id <>
       (select public.get_current_user_restaurant_id()) THEN
      RAISE EXCEPTION 'Funcionário pertence a outro restaurante';
    END IF;
  END IF;


  RETURN QUERY
  SELECT
    p.id,
    p.name,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM public.employee_permissions ep
        WHERE ep.employee_id = p_employee_id
          AND ep.permission_id = p.id
      )
      AND EXISTS (
        SELECT 1
        FROM public.employees e
        JOIN public.role_permissions rp
          ON rp.role_id = e.role_id
        WHERE e.id = p_employee_id
          AND rp.permission_id = p.id
      )
      THEN 'role + individual'::text

      WHEN EXISTS (
        SELECT 1
        FROM public.employee_permissions ep
        WHERE ep.employee_id = p_employee_id
          AND ep.permission_id = p.id
      )
      THEN 'individual'::text

      ELSE 'role'::text
    END
  FROM public.permissions p
  WHERE
    EXISTS (
      SELECT 1
      FROM public.employees e
      JOIN public.role_permissions rp
        ON rp.role_id = e.role_id
      WHERE e.id = p_employee_id
        AND rp.permission_id = p.id
    )
    OR EXISTS (
      SELECT 1
      FROM public.employee_permissions ep
      WHERE ep.employee_id = p_employee_id
        AND ep.permission_id = p.id
    )
  ORDER BY p.id;

END;
$function$;


-- ------------------------------------------------------------
-- 8. Segurança dos RPCs
-- ------------------------------------------------------------

REVOKE ALL
ON FUNCTION public.get_employee_permissions(bigint)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.grant_employee_permission(bigint, bigint)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.revoke_employee_permission(bigint, bigint)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.get_employee_effective_permissions(bigint)
FROM PUBLIC;


GRANT EXECUTE
ON FUNCTION public.get_employee_permissions(bigint)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.grant_employee_permission(bigint, bigint)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.revoke_employee_permission(bigint, bigint)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.get_employee_effective_permissions(bigint)
TO authenticated;


-- ------------------------------------------------------------
-- 9. Grants da tabela
--
-- O frontend utiliza os RPCs para alterar permissões.
-- INSERT/DELETE não são expostos diretamente ao cliente.
-- ------------------------------------------------------------

REVOKE ALL
ON TABLE public.employee_permissions
FROM anon;

GRANT SELECT
ON TABLE public.employee_permissions
TO authenticated;
