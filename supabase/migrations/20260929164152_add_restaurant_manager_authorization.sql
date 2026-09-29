-- ============================================================
-- RestaurantOS
-- Restaurant manager authorization + restaurants RLS
-- ============================================================


-- ------------------------------------------------------------
-- 1. Helper: check whether current user is a restaurant manager
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION private.is_restaurant_manager(
  p_restaurant_id bigint
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.employees e
    JOIN public.roles r
      ON r.id = e.role_id
    WHERE e.user_id = (SELECT auth.uid())
      AND e.restaurant_id = p_restaurant_id
      AND e.status = 'active'
      AND r.name = 'manager'
  );
$$;


-- ------------------------------------------------------------
-- 2. Protect the helper function
-- ------------------------------------------------------------

REVOKE EXECUTE
ON FUNCTION private.is_restaurant_manager(bigint)
FROM PUBLIC;

GRANT USAGE
ON SCHEMA private
TO authenticated;

GRANT EXECUTE
ON FUNCTION private.is_restaurant_manager(bigint)
TO authenticated;


-- ------------------------------------------------------------
-- 3. Remove old policies if they exist
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "restaurants_select"
ON public.restaurants;

DROP POLICY IF EXISTS "restaurants_insert"
ON public.restaurants;

DROP POLICY IF EXISTS "restaurants_update"
ON public.restaurants;

DROP POLICY IF EXISTS "restaurants_delete"
ON public.restaurants;


-- ------------------------------------------------------------
-- 4. Enable Row Level Security
-- ------------------------------------------------------------

ALTER TABLE public.restaurants
ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- 5. Table grants
-- ------------------------------------------------------------

REVOKE ALL
ON TABLE public.restaurants
FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.restaurants
TO authenticated;


-- ------------------------------------------------------------
-- 6. SELECT
--
-- Platform Admin:
--   access to every restaurant.
--
-- Normal employee:
--   access only to restaurants where they have
--   an active membership.
-- ------------------------------------------------------------

CREATE POLICY "restaurants_select"
ON public.restaurants
FOR SELECT
TO authenticated
USING (
  (SELECT private.has_restaurant_access(id))
);


-- ------------------------------------------------------------
-- 7. INSERT
--
-- Only Platform Admin can create restaurants.
-- ------------------------------------------------------------

CREATE POLICY "restaurants_insert"
ON public.restaurants
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT private.is_platform_admin())
);


-- ------------------------------------------------------------
-- 8. UPDATE
--
-- Platform Admin:
--   can update any restaurant.
--
-- Manager:
--   can update only their own restaurant.
-- ------------------------------------------------------------

CREATE POLICY "restaurants_update"
ON public.restaurants
FOR UPDATE
TO authenticated
USING (
  (SELECT private.is_platform_admin())
  OR
  (SELECT private.is_restaurant_manager(id))
)
WITH CHECK (
  (SELECT private.is_platform_admin())
  OR
  (SELECT private.is_restaurant_manager(id))
);


-- ------------------------------------------------------------
-- 9. DELETE
--
-- Only Platform Admin can delete restaurants.
-- ------------------------------------------------------------

CREATE POLICY "restaurants_delete"
ON public.restaurants
FOR DELETE
TO authenticated
USING (
  (SELECT private.is_platform_admin())
);