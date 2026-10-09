import { supabase } from "../../../services/supabase";

// READ ALL TABLES
export async function getTables(restaurantId) {
  let query = supabase
    .from("tables")
    .select(
      `
      *,
      restaurants (
        id,
        name
      )
    `,
    )
    .order("table_number");

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

// GET A SINGLE TABLE
export async function getTable(id) {
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// CREATE A TABLE
export async function createTable(newTable) {
  let restaurantId = newTable.restaurant_id;

  // Utilizadores normais não precisam de indicar o restaurante.
  // O restaurante é determinado pelo contexto do utilizador autenticado.
  if (!restaurantId) {
    const { data, error } = await supabase.rpc(
      "get_current_user_restaurant_id",
    );

    if (error) {
      throw new Error(error.message);
    }

    restaurantId = data;
  }

  if (!restaurantId) {
    throw new Error("Could not determine the current restaurant.");
  }

  const { data, error } = await supabase
    .from("tables")
    .insert([
      {
        ...newTable,
        restaurant_id: restaurantId,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// DELETE TABLE
export async function deleteTable(id) {
  const { error } = await supabase.from("tables").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

// UPDATE A TABLE
export async function updateTable(id, updatedTable) {
  const { data, error } = await supabase
    .from("tables")
    .update(updatedTable)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
