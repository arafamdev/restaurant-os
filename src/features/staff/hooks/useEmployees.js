import { useQuery } from "@tanstack/react-query";

import { getEmployees } from "../services/employeeService";

export function useEmployees() {
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  return {
    employees,
    isLoading,
    error,
  };
}
