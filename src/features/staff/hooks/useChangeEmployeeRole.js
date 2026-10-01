import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changeEmployeeRole } from "../services/employeeService";

export function useChangeEmployeeRole() {
  const queryClient = useQueryClient();

  const {
    mutate: changeRole,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ employeeId, roleId }) =>
      changeEmployeeRole(employeeId, roleId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee", String(variables.employeeId)],
      });
    },
  });

  return {
    changeRole,
    isPending,
    error,
  };
}
