import { supabase } from "../../../services/supabase";

// GET RESTAURANTS
export async function getRestaurants() {
  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}