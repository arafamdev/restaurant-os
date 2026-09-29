
-- ============================================================
-- RestaurantOS
-- Secure restaurant memberships with RLS
-- ============================================================

-- ============================================================
-- 1. Trigger function
--    Prevents a restaurant from losing its last active manager
-- ============================================================

CREATE OR REPLACE FUNCTION private.prevent_last_manager_membership_deactivation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_is_manager boolean;
  remaining_managers integer;
BEGIN
  -- Only relevant when an active membership becomes inactive.
  IF OLD.status = 'active' AND NEW.status = 'inactive' THEN

    SELECT EXISTS (
      SELECT 1
      FROM public.employees e
      JOIN public.roles r
        ON r.id = e.role_id
      WHERE e.user_id = OLD.user_id
        AND e.restaurant_id = OLD.restaurant_id
        AND e.status = 'active'
        AND r.name = 'manager'
    )
    INTO target_is_manager;

    IF target_is_manager THEN

      SELECT count(*)
      INTO remaining_managers
      FROM public.employees e
      JOIN public.roles r
        ON r.id = e.role_id
      JOIN public.restaurant_memberships rm
        ON rm.user_id = e.user_id
       AND rm.restaurant_id = e.restaurant_id
      WHERE e.restaurant_id = OLD.restaurant_id
        AND e.status = 'active'
        AND r.name = 'manager'
        AND rm.status = 'active'
        AND e.user_id <> OLD.user_id;

      IF remaining_managers = 0 THEN
        RAISE EXCEPTION
          'The restaurant must have at least one active manager.';
      END IF;

    END IF;

  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE
ON FUNCTION private.prevent_last_manager_membership_deactivation()
FROM PUBLIC;


-- ============================================================
-- 2. Trigger
-- ============================================================

DROP TRIGGER IF EXISTS prevent_last_manager_membership_deactivation
ON public.restaurant_memberships;

CREATE TRIGGER prevent_last_manager_membership_deactivation
BEFORE UPDATE OF status
ON public.restaurant_memberships
FOR EACH ROW
EXECUTE FUNCTION private.prevent_last_manager_membership_deactivation();


-- ============================================================
-- 3. RLS
-- ============================================================

ALTER TABLE public.restaurant_memberships
ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 4. Grants
-- ============================================================

REVOKE ALL
ON TABLE public.restaurant_memberships
FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE
ON TABLE public.restaurant_memberships
TO authenticated;


-- ============================================================
-- 5. Remove previous policies if they exist
-- ============================================================

DROP POLICY IF EXISTS "restaurant_memberships_select"
ON public.restaurant_memberships;

DROP POLICY IF EXISTS "restaurant_memberships_insert"
ON public.restaurant_memberships;

DROP POLICY IF EXISTS "restaurant_memberships_update"
ON public.restaurant_memberships;


-- ============================================================
-- 6. SELECT
--
-- Platform Admin:
--   can see memberships from every restaurant.
--
-- Restaurant Manager:
--   can see memberships from their own restaurant.
-- ============================================================

CREATE POLICY "restaurant_memberships_select"
ON public.restaurant_memberships
FOR SELECT
TO authenticated
USING (
  (SELECT private.is_platform_admin())
  OR
  (
    (SELECT private.is_restaurant_manager(restaurant_id))
  )
);


-- ============================================================
-- 7. INSERT
--
-- Platform Admin:
--   can create membership anywhere.
--
-- Restaurant Manager:
--   can create membership only inside their restaurant.
--
-- created_by must always be the authenticated user.
-- ============================================================

CREATE POLICY "restaurant_memberships_insert"
ON public.restaurant_memberships
FOR INSERT
TO authenticated
WITH CHECK (
  (
    (SELECT private.is_platform_admin())
    OR
    (SELECT private.is_restaurant_manager(restaurant_id))
  )
  AND
  created_by = (SELECT auth.uid())
);


-- ============================================================
-- 8. UPDATE
--
-- Platform Admin:
--   can update memberships anywhere.
--
-- Restaurant Manager:
--   can update memberships only inside their restaurant.
--
-- The trigger above protects the last-manager rule.
-- ============================================================

CREATE POLICY "restaurant_memberships_update"
ON public.restaurant_memberships
FOR UPDATE
TO authenticated
USING (
  (SELECT private.is_platform_admin())
  OR
  (
    (SELECT private.is_restaurant_manager(restaurant_id))
  )
)
WITH CHECK (
  (SELECT private.is_platform_admin())
  OR
  (
    (SELECT private.is_restaurant_manager(restaurant_id))
  )
);

