import { supabase } from "../../../services/supabase";

// Busca o funcionário através do ID.
//
// Usamos esta função para obter o nome do funcionário
// responsável pela abertura ou fechamento.
async function getEmployeeById(employeeId) {
  if (!employeeId) {
    return null;
  }

  const { data, error } = await supabase
    .from("employees")
    .select("id, full_name")
    .eq("id", employeeId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Adiciona os dados dos funcionários ao Restaurant Day.
//
// restaurant_days guarda apenas:
// opened_by
// closed_by
//
// Aqui transformamos esses IDs nos respectivos funcionários.
async function enrichRestaurantDay(restaurantDay) {
  if (!restaurantDay) {
    return null;
  }

  const [openedEmployee, closedEmployee] = await Promise.all([
    getEmployeeById(restaurantDay.opened_by),
    getEmployeeById(restaurantDay.closed_by),
  ]);

  return {
    ...restaurantDay,
    opened_employee: openedEmployee,
    closed_employee: closedEmployee,
  };
}

// Busca o Restaurant Day atualmente ativo.
//
// Um Restaurant Day ativo pode estar:
// - open
// - closing
export async function getActiveRestaurantDay() {
  const { data, error } = await supabase
    .from("restaurant_days")
    .select(
      `
      id,
      business_date,
      status,
      opened_at,
      opened_by,
      opening_cash,
      notes,
      created_at
    `,
    )
    .in("status", ["open", "closing"])
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return enrichRestaurantDay(data);
}

// Busca o último Restaurant Day.
//
// Ao contrário de getActiveRestaurantDay(),
// esta função também encontra dias com status "closed".
export async function getLatestRestaurantDay() {
  const { data, error } = await supabase
    .from("restaurant_days")
    .select(
      `
      id,
      business_date,
      status,
      opened_at,
      opened_by,
      opening_cash,
      notes,
      closed_at,
      closed_by,
      closing_cash,
      created_at
    `,
    )
    .order("business_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return enrichRestaurantDay(data);
}

// Abre um novo Restaurant Day.
//
// A abertura é executada através da RPC PostgreSQL.
export async function openRestaurantDay({ businessDate, openingCash, notes }) {
  const { data, error } = await supabase.rpc("open_restaurant_day", {
    p_business_date: businessDate,
    p_opening_cash: Number(openingCash),
    p_notes: notes || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Fecha o Restaurant Day atualmente ativo.
//
// O PostgreSQL descobre automaticamente o employee
// através de auth.uid().
export async function closeRestaurantDay({ closingCash, notes }) {
  const { data, error } = await supabase.rpc("close_restaurant_day", {
    p_closing_cash: Number(closingCash),
    p_notes: notes || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
