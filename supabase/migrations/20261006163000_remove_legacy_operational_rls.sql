-- ============================================================
-- Remove policies antigas e inseguras das tabelas operacionais.
-- As novas policies tenant-scoped já foram criadas na migration
-- anterior.
-- ============================================================


-- ============================================================
-- DAILY MENUS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert daily menus"
ON public.daily_menus;

DROP POLICY IF EXISTS "Authenticated users can select daily menus"
ON public.daily_menus;


-- ============================================================
-- DAILY MENU OPTIONS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert daily menu options"
ON public.daily_menu_options;

DROP POLICY IF EXISTS "Authenticated users can select daily menu options"
ON public.daily_menu_options;