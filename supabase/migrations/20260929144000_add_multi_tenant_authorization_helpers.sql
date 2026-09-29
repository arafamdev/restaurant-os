
-- ============================================================
-- RestaurantOS
-- Migration: multi-tenant authorization helpers
-- ============================================================


-- ============================================================
-- 1. Schema privado
--
-- Este schema não será exposto pela Data API.
-- As funções aqui serão utilizadas internamente pelo RLS.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS private;


-- ============================================================
-- 2. Verificar se o utilizador atual é Platform Admin
-- ============================================================

CREATE OR REPLACE FUNCTION private.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_admins pa
    WHERE pa.user_id = (SELECT auth.uid())
  );
$$;


-- ============================================================
-- 3. Verificar acesso do utilizador a um restaurante
--
-- Regras:
--
-- 1. Platform Admin tem acesso global.
--
-- 2. Caso contrário, o utilizador precisa de uma
--    restaurant_membership ativa para o restaurante.
-- ============================================================

CREATE OR REPLACE FUNCTION private.has_restaurant_access(
  p_restaurant_id bigint
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    private.is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM public.restaurant_memberships rm
      WHERE rm.user_id = (SELECT auth.uid())
        AND rm.restaurant_id = p_restaurant_id
        AND rm.status = 'active'
    );
$$;


-- ============================================================
-- 4. Segurança das funções
--
-- As funções não devem ficar disponíveis para chamadas
-- públicas através da Data API.
-- ============================================================

REVOKE EXECUTE
ON FUNCTION private.is_platform_admin()
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION private.has_restaurant_access(bigint)
FROM PUBLIC;


-- ============================================================
-- 5. Permitir utilização interna pelas requests autenticadas
--
-- O RLS poderá utilizar estas funções explicitamente através
-- do schema private.
-- ============================================================

GRANT USAGE
ON SCHEMA private
TO authenticated;

GRANT EXECUTE
ON FUNCTION private.is_platform_admin()
TO authenticated;

GRANT EXECUTE
ON FUNCTION private.has_restaurant_access(bigint)
TO authenticated;

