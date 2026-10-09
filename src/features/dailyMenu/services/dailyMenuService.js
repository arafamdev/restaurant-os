import { supabase } from "../../../services/supabase";

// Buscar todos os daily menus
export async function getDailyMenus(restaurantId) {
  let query = supabase
    .from("daily_menus")
    .select(
      `
      id,
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
      is_active,
      restaurant_id,
      restaurants (
        id,
        name
      ),
      created_at,
      updated_at
    `,
    )
    .order("created_at", {
      ascending: false,
    });

  // "all" significa que o Platform Admin quer visualizar todos os restaurantes.
  if (restaurantId !== "all") {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// MENU OPTIONS
export async function getDailyMenuOptions() {
  const { data, error } = await supabase
    .from("daily_menu_options")
    .select(
      `
      id,
      daily_menu_id,
      menu_item_id,
      component_type,
      created_at,
      menu_items (
        id,
        name,
        description,
        price,
        image_url,
        is_active,
        is_available,
        category_id
      )
    `,
    )
    .order("component_type");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// GET DAILY MENU BY ID
export async function getDailyMenuById(id) {
  const { data, error } = await supabase
    .from("daily_menus")
    .select(
      `
      id,
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
      is_active,
      restaurant_id,
      restaurants (
        id,
        name
      ),
      created_at,
      updated_at,
      daily_menu_options (
        id,
        menu_item_id,
        component_type,
        menu_items (
          id,
          name,
          description,
          price,
          image_url,
          is_active,
          is_available,
          category_id
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Criar um novo Daily Menu
export async function createDailyMenu(newDailyMenu) {
  const { data, error } = await supabase.rpc("create_daily_menu", {
    p_restaurant_id: Number(newDailyMenu.restaurant_id),
    p_name: newDailyMenu.name,
    p_description: newDailyMenu.description || null,
    p_menu_type: newDailyMenu.menu_type,
    p_price: Number(newDailyMenu.price),
    p_start_time: newDailyMenu.start_time,
    p_end_time: newDailyMenu.end_time,
    p_monday: newDailyMenu.monday,
    p_tuesday: newDailyMenu.tuesday,
    p_wednesday: newDailyMenu.wednesday,
    p_thursday: newDailyMenu.thursday,
    p_friday: newDailyMenu.friday,
    p_saturday: newDailyMenu.saturday,
    p_sunday: newDailyMenu.sunday,
    p_include_bread: newDailyMenu.include_bread,
    p_include_coffee: newDailyMenu.include_coffee,
    p_options: newDailyMenu.options,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// UPDATE DAILY MENU
export async function updateDailyMenu({
  id,
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
  options,
}) {
  const { data, error } = await supabase.rpc("update_daily_menu", {
    p_daily_menu_id: id,
    p_name: name,
    p_description: description || null,
    p_menu_type: menu_type,
    p_price: Number(price),

    p_start_time: start_time,
    p_end_time: end_time,

    p_monday: monday,
    p_tuesday: tuesday,
    p_wednesday: wednesday,
    p_thursday: thursday,
    p_friday: friday,
    p_saturday: saturday,
    p_sunday: sunday,

    p_include_bread: include_bread,
    p_include_coffee: include_coffee,

    p_options: options,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// UPDATE DAILY MENU STATUS
export async function updateDailyMenuStatus(id, isActive) {
  const { data, error } = await supabase
    .from("daily_menus")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// DELETE DAILY MENU
export async function deleteDailyMenu(id) {
  const { error } = await supabase.from("daily_menus").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
