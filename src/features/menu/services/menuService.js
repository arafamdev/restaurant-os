import { supabase } from "../../../services/supabase";

export async function getMenuItems() {
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
      menu_categories (
        id,
        name,
        display_order,
        group_type
      )
    `,
    )
    .order("name");

  if (error) throw new Error(error.message);

  return data;
}

export async function getMenuCategories() {
  const { data, error } = await supabase
    .from("menu_categories")
    .select(
      `
      id,
      name,
      description,
      display_order,
      is_active,
      group_type
    `,
    )
    .order("display_order");

  if (error) throw new Error(error.message);

  return data;
}

export async function createMenuItem(newMenuItem) {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([newMenuItem])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}


export async function updateMenuItem(id, updatedMenuItem) {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updatedMenuItem)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}