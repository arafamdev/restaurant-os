import { useMutation } from "@tanstack/react-query";

import { changeEmployeeRole } from "../services/employeeService";

export function useChangeEmployeeRole() {
  const {
    mutate: changeRole,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ employeeId, roleId }) =>
      changeEmployeeRole(employeeId, roleId),
  });

  return {
    changeRole,
    isPending,
    error,
  };
}
