-- Permite que utilizadores autenticados leiam os catálogos
-- de atributos alimentares e alergénios.

GRANT SELECT
ON TABLE public.dietary_attributes
TO authenticated;

GRANT SELECT
ON TABLE public.allergens
TO authenticated;

GRANT SELECT
ON TABLE public.menu_item_dietary_attributes
TO authenticated;

GRANT SELECT
ON TABLE public.menu_item_allergens
TO authenticated;
