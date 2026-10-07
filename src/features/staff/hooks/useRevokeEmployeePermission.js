import { useMutation, useQueryClient } from "@tanstack/react-query";

import { revokeEmployeePermission } from "../services/employeeService";

export function useRevokeEmployeePermission() {
  const queryClient = useQueryClient();

  const {
    mutate: revokePermission,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ employeeId, permissionId }) =>
      revokeEmployeePermission(Number(employeeId), Number(permissionId)),

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
    revokePermission,
    isPending,
    error,
  };
}
