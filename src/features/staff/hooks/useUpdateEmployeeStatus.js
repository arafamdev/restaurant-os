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
      updateEmployeeStatus(employeeId, status),

    onSuccess: (_, variables) => {
      // Atualizar a lista de funcionários
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Atualizar os detalhes do funcionário
      queryClient.invalidateQueries({
        queryKey: ["employee", variables.employeeId],
      });
    },
  });

  return {
    updateStatus,
    isPending,
    error,
  };
}
