import { supabase } from "../../../services/supabase";

// Busca um funcionário pelo ID.
// A RLS garante que apenas funcionários acessíveis
// ao utilizador autenticado podem ser consultados.
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

// Adiciona os dados dos funcionários responsáveis
// pela abertura e pelo fecho do Restaurant Day.
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
// A RLS limita os resultados ao restaurante do utilizador.
// Um dia ativo pode estar em estado "open" ou "closing".
export async function getActiveRestaurantDay() {
  const { data, error } = await supabase
    .from("restaurant_days")
    .select(
      `
      id,
      restaurant_id,
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

// Busca o Restaurant Day mais recente.
//
// A RLS limita os resultados ao restaurante do utilizador.
// Para um utilizador normal, o resultado pertence sempre
// ao seu restaurante.
export async function getLatestRestaurantDay() {
  const { data, error } = await supabase
    .from("restaurant_days")
    .select(
      `
      id,
      restaurant_id,
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
// O PostgreSQL determina automaticamente:
// - o funcionário responsável;
// - o restaurante;
// - as permissions necessárias.
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
// O PostgreSQL determina automaticamente:
// - o funcionário responsável;
// - o restaurante;
// - o Restaurant Day que deve ser fechado;
// - as permissions necessárias.
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
