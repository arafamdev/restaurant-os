import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateEmployeeStatus } from "../services/employeeService";

export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();

  const {
    mutate: updateStatus,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ employeeId, status }) =>
      updateEmployeeStatus(Number(employeeId), status),

    onSuccess: (_, variables) => {
      const employeeId = Number(variables.employeeId);

      // Atualizar a lista de funcionários
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Atualizar os detalhes do funcionário
      queryClient.invalidateQueries({
        queryKey: ["employee", employeeId],
      });
    },
  });

  return {
    updateStatus,
    isPending,
    error,
  };
}
