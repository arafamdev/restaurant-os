import { supabase } from "../../../services/supabase";

export async function getEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      id,
      full_name,
      phone,
      status,
      roles (
        id,
        name
      )
    `,
    )
    .order("full_name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
