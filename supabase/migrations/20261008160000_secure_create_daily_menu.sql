
-- ==================================================
-- SECURE CREATE DAILY MENU
-- ==================================================
-- Adiciona o contexto de restaurante ao RPC de criação
-- do Daily Menu e garante autorização multi-tenant.
-- ==================================================

CREATE OR REPLACE FUNCTION public.create_daily_menu(
  p_restaurant_id bigint,
  p_name text,
  p_description text,
  p_menu_type text,
  p_price numeric,
  p_start_time time without time zone,
  p_end_time time without time zone,
  p_monday boolean,
  p_tuesday boolean,
  p_wednesday boolean,
  p_thursday boolean,
  p_friday boolean,
  p_saturday boolean,
  p_sunday boolean,
  p_include_bread boolean,
  p_include_coffee boolean,
  p_options jsonb
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
DECLARE
  new_daily_menu_id bigint;
  current_restaurant_id bigint;
BEGIN

  -- ==================================================
  -- 1. Validar restaurante
  -- ==================================================

  IF p_restaurant_id IS NULL THEN
    RAISE EXCEPTION 'Restaurant is required.';
  END IF;


  -- ==================================================
  -- 2. Verificar autorização
  -- ==================================================

  IF NOT (
    public.is_current_user_platform_admin()
    OR (
      p_restaurant_id = public.get_current_user_restaurant_id()
      AND public.has_permission('manage_menu')
    )
  ) THEN
    RAISE EXCEPTION
      'You are not authorized to manage daily menus in this restaurant.';
  END IF;


  -- ==================================================
  -- 3. Criar o Daily Menu inativo
  -- ==================================================

  INSERT INTO public.daily_menus (
    restaurant_id,
    name,
    description,
    menu_type,
    price,
    start_time,
    end_time,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    include_bread,
    include_coffee,
    is_active
  )
  VALUES (
    p_restaurant_id,
    p_name,
    p_description,
    p_menu_type,
    p_price,
    p_start_time,
    p_end_time,
    p_monday,
    p_tuesday,
    p_wednesday,
    p_thursday,
    p_friday,
    p_saturday,
    p_sunday,
    p_include_bread,
    p_include_coffee,
    false
  )
  RETURNING id INTO new_daily_menu_id;


  -- ==================================================
  -- 4. Criar as opções do Daily Menu
  -- ==================================================

  INSERT INTO public.daily_menu_options (
    daily_menu_id,
    menu_item_id,
    component_type,
    restaurant_id
  )
  SELECT
    new_daily_menu_id,
    (option->>'menu_item_id')::bigint,
    option->>'component_type',
    p_restaurant_id
  FROM jsonb_array_elements(p_options) AS option;


  -- ==================================================
  -- 5. Ativar o Daily Menu
  -- ==================================================
  -- A ativação mantém as validações existentes
  -- do sistema.

  UPDATE public.daily_menus
  SET is_active = true
  WHERE id = new_daily_menu_id;


  -- ==================================================
  -- 6. Retornar o ID criado
  -- ==================================================

  RETURN new_daily_menu_id;

END;
$function$;
