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
  const { data, error } = await supabase.rpc("get_employee_details", {
    p_employee_id: Number(employeeId),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// CHANGE EMPLOYEE ROLE
export async function changeEmployeeRole(employeeId, roleId) {
  const { data, error } = await supabase.rpc("change_employee_role", {
    p_employee_id: Number(employeeId),
    p_role_id: Number(roleId),
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
    if (error.context) {
      const errorBody = await error.context.json().catch(() => null);

      if (errorBody?.code === "email_exists") {
        throw new Error("This email address is already registered.");
      }

      if (errorBody?.message) {
        throw new Error(errorBody.message);
      }
    }

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

// UPDATE EMPLOYEE STATUS
export async function updateEmployeeStatus(employeeId, status) {
  const { data, error } = await supabase.rpc("update_employee_status", {
    p_employee_id: Number(employeeId),
    p_employee_status: status,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// GET INDIVIDUAL EMPLOYEE PERMISSIONS
export async function getEmployeePermissions(employeeId) {
  const { data, error } = await supabase.rpc("get_employee_permissions", {
    p_employee_id: Number(employeeId),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// GET EFFECTIVE EMPLOYEE PERMISSIONS
export async function getEmployeeEffectivePermissions(employeeId) {
  const { data, error } = await supabase.rpc(
    "get_employee_effective_permissions",
    {
      p_employee_id: Number(employeeId),
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// GRANT INDIVIDUAL EMPLOYEE PERMISSION
export async function grantEmployeePermission(employeeId, permissionId) {
  const { data, error } = await supabase.rpc("grant_employee_permission", {
    p_employee_id: Number(employeeId),
    p_permission_id: Number(permissionId),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// REVOKE INDIVIDUAL EMPLOYEE PERMISSION
export async function revokeEmployeePermission(employeeId, permissionId) {
  const { data, error } = await supabase.rpc("revoke_employee_permission", {
    p_employee_id: Number(employeeId),
    p_permission_id: Number(permissionId),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// GET ALL PERMISSIONS
export async function getPermissions() {
  const { data, error } = await supabase
    .from("permissions")
    .select("id, name")
    .order("id");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
