import { supabase } from "../../../services/supabase";

export async function getReservations(restaurantId) {
  let query = supabase
    .from("reservations")
    .select(
      `
      *,
      customers (
        full_name,
        email,
        phone
      ),
      tables (
        table_number,
        capacity,
        location
      ),
      restaurants (
        id,
        name
      )
    `,
    )
    .order("starts_at");

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

export async function getReservation(id) {
  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
      *,
      customers (
        full_name,
        email,
        phone
      ),
      tables (
        table_number,
        capacity,
        location
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

export async function createReservation(newReservation) {
  const { data, error } = await supabase
    .from("reservations")
    .insert([newReservation])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateReservationStatus(id, status) {
  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
