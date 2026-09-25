import { supabase } from "../../../services/supabase";

// READ ALL TABLES
export async function getTables() {
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .order("table_number");

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
  const { data, error } = await supabase
    .from("tables")
    .insert([newTable])
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
