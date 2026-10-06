import { useQuery } from "@tanstack/react-query";

import { getEmployeeById } from "../services/employeeService";

export function useEmployee(employeeId) {
  const normalizedEmployeeId = Number(employeeId);

  const {
    data: employee,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee", normalizedEmployeeId],
    queryFn: () => getEmployeeById(normalizedEmployeeId),
    enabled: Number.isFinite(normalizedEmployeeId),
  });

  return {
    employee,
    isLoading,
    error,
  };
}
