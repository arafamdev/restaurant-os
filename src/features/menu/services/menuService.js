import { supabase } from "../../../services/supabase";

// ==================================================
// MENU ITEMS
// ==================================================

// Normalizar características dietéticas
function normalizeDietaryAttributes(item) {
  return (
    item.menu_item_dietary_attributes?.map(
      ({ dietary_attributes }) => dietary_attributes,
    ) || []
  );
}

// Normalizar alergénios
function normalizeAllergens(item) {
  return item.menu_item_allergens?.map(({ allergens }) => allergens) || [];
}

// Normalizar um item do menu
function normalizeMenuItem(item) {
  return {
    ...item,
    dietaryAttributes: normalizeDietaryAttributes(item),
    allergens: normalizeAllergens(item),
  };
}

// Buscar todos os itens do menu
export async function getMenuItems(restaurantId) {
  let query = supabase
    .from("menu_items")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      is_active,
      is_available,
      category_id,
      restaurant_id,
      restaurants (
        id,
        name
      ),
      menu_categories (
        id,
        name,
        display_order,
        group_type
      ),
      menu_item_dietary_attributes (
        dietary_attributes (
          id,
          code,
          name,
          description,
          display_order
        )
      ),
      menu_item_allergens (
        allergens (
          id,
          code,
          name,
          description,
          display_order
        )
      )
    `,
    )
    .order("name");

  // "all" means that the Platform Admin wants all restaurants.
  if (restaurantId !== "all") {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data.map(normalizeMenuItem);
}

// Buscar um item específico do menu
export async function getMenuItemById(id) {
  const { data, error } = await supabase
    .from("menu_items")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      is_active,
      is_available,
      category_id,
      restaurant_id,
      restaurants (
        id,
        name
      ),
      menu_categories (
        id,
        name,
        description,
        display_order,
        group_type
      ),
      menu_item_dietary_attributes (
        dietary_attributes (
          id,
          code,
          name,
          description,
          display_order
        )
      ),
      menu_item_allergens (
        allergens (
          id,
          code,
          name,
          description,
          display_order
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeMenuItem(data);
}

// Criar um novo item do menu
export async function createMenuItem(newMenuItem) {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([newMenuItem])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Atualizar um item do menu
export async function updateMenuItem(id, updatedMenuItem) {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updatedMenuItem)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ==================================================
// MENU CATEGORIES
// ==================================================

// Buscar todas as categorias do menu
export async function getMenuCategories(restaurantId) {
  let query = supabase
    .from("menu_categories")
    .select(
      `
      id,
      name,
      description,
      display_order,
      is_active,
      group_type,
      restaurant_id,
      restaurants (
        id,
        name
      )
    `,
    )
    .order("display_order");

  // "all" means that the Platform Admin wants all restaurants.
  if (restaurantId !== "all") {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
