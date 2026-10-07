-- ============================================================
-- EMPLOYEE PERMISSIONS
-- Remover RPCs antigos e inseguros
-- ============================================================

-- ------------------------------------------------------------
-- 1. Remover versão antiga de grant
-- ------------------------------------------------------------

DROP FUNCTION IF EXISTS public.grant_employee_permission(
  bigint,
  text
);


-- ------------------------------------------------------------
-- 2. Remover versão antiga de revoke
-- ------------------------------------------------------------

DROP FUNCTION IF EXISTS public.revoke_employee_permission(
  bigint,
  text
);
