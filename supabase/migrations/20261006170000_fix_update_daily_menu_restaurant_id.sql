-- Corrige a atualização de Daily Menus para preservar
-- o restaurant_id nas opções associadas.

CREATE OR REPLACE FUNCTION public.update_daily_menu(
  p_daily_menu_id bigint,
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
AS $function$
DECLARE
  current_is_active boolean;
  current_restaurant_id bigint;
BEGIN

  /*
   * 1. Verificar se o Daily Menu existe
   *    e obter o restaurante associado.
   */
  SELECT
    is_active,
    restaurant_id
  INTO
    current_is_active,
    current_restaurant_id
  FROM public.daily_menus
  WHERE id = p_daily_menu_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Daily menu with id % does not exist.',
      p_daily_menu_id;
  END IF;

  /*
   * 2. Desativar temporariamente.
   */
  UPDATE public.daily_menus
  SET is_active = false
  WHERE id = p_daily_menu_id;

  /*
   * 3. Atualizar os dados principais.
   */
  UPDATE public.daily_menus
  SET
    name = p_name,
    description = p_description,
    menu_type = p_menu_type,
    price = p_price,
    start_time = p_start_time,
    end_time = p_end_time,

    monday = p_monday,
    tuesday = p_tuesday,
    wednesday = p_wednesday,
    thursday = p_thursday,
    friday = p_friday,
    saturday = p_saturday,
    sunday = p_sunday,

    include_bread = p_include_bread,
    include_coffee = p_include_coffee,

    updated_at = now()
  WHERE id = p_daily_menu_id;

  /*
   * 4. Remover as opções antigas.
   */
  DELETE FROM public.daily_menu_options
  WHERE daily_menu_id = p_daily_menu_id;

  /*
   * 5. Inserir as novas opções.
   *
   * O restaurant_id é obtido diretamente do
   * Daily Menu para manter a relação correta
   * entre menu, opções e restaurante.
   */
  INSERT INTO public.daily_menu_options (
    daily_menu_id,
    menu_item_id,
    component_type,
    restaurant_id
  )
  SELECT
    p_daily_menu_id,
    (option->>'menu_item_id')::bigint,
    option->>'component_type',
    current_restaurant_id
  FROM jsonb_array_elements(p_options) AS option;

  /*
   * 6. Restaurar o estado original.
   */
  UPDATE public.daily_menus
  SET is_active = current_is_active
  WHERE id = p_daily_menu_id;

  /*
   * 7. Retornar o ID.
   */
  RETURN p_daily_menu_id;

END;
$function$;
