import { supabase } from "../../../services/supabase";

// GET ALL EMPLOYEES
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

// GET SINGLE EMPLOYEE BY ID
export async function getEmployeeById(employeeId) {
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      id,
      full_name,
      phone,
      status,
      restaurant_id,
      created_at,
      roles (
        id,
        name
      )
    `,
    )
    .eq("id", employeeId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// CHANGE EMPLOYEE ROLES (ONLY MANAGER)
export async function changeEmployeeRole(employeeId, roleId) {
  const { data, error } = await supabase.rpc("change_employee_role", {
    p_employee_id: employeeId,
    p_role_id: roleId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// GET ROLES
export async function getRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name")
    .order("id");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// CREATE EMPLOYEE
export async function createEmployee({
  email,
  full_name,
  phone,
  role_id,
  restaurant_id,
}) {
  const { data, error } = await supabase.functions.invoke("create-employee", {
    body: {
      email,
      full_name,
      phone,
      role_id,
      restaurant_id,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.message && !data?.success) {
    throw new Error(data.message);
  }

  return data;
}

// GET ALL RESTAURANTS
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
