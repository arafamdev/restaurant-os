import { useMutation, useQueryClient } from "@tanstack/react-query";

import { grantEmployeePermission } from "../services/employeeService";

export function useGrantEmployeePermission() {
  const queryClient = useQueryClient();

  const {
    mutate: grantPermission,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ employeeId, permissionId }) =>
      grantEmployeePermission(Number(employeeId), Number(permissionId)),

    onSuccess: (_, variables) => {
      const employeeId = Number(variables.employeeId);

      queryClient.invalidateQueries({
        queryKey: ["employee-permissions", employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee-effective-permissions", employeeId],
      });
    },
  });

  return {
    grantPermission,
    isPending,
    error,
  };
}