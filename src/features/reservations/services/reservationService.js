import { supabase } from "../../../services/supabase";

export async function getReservations() {
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
    .order("starts_at");

  if (error) throw new Error(error.message);

  return data;
}
