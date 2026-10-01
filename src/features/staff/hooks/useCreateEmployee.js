import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createEmployee } from "../services/employeeService";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  const {
    mutate: createEmployeeMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: createEmployee,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });

  return {
    createEmployee: createEmployeeMutation,
    isPending,
    error,
  };
}
