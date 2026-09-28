import { useQuery } from "@tanstack/react-query";

import { getEmployeeById } from "../services/employeeService";

export function useEmployee(employeeId) {
  const {
    isLoading,
    data: employee,
    error,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployeeById(employeeId),
    enabled: Boolean(employeeId),
  });

  return {
    isLoading,
    employee,
    error,
  };
}
