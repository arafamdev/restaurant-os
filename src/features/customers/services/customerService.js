import { supabase } from "../../../services/supabase";

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, email, phone")
    .order("full_name");

  if (error) throw new Error(error.message);

  return data;
}
