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
      const employeeId = Number(variables.employeeId);

      // Atualiza a lista de funcionários.
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Atualiza os dados do funcionário.
      queryClient.invalidateQueries({
        queryKey: ["employee", employeeId],
      });

      // Atualiza as permissões individuais.
      queryClient.invalidateQueries({
        queryKey: ["employee-permissions", employeeId],
      });

      // Atualiza as permissões efetivas provenientes do novo role.
      queryClient.invalidateQueries({
        queryKey: ["employee-effective-permissions", employeeId],
      });
    },
  });

  return {
    changeRole,
    isPending,
    error,
  };
}
