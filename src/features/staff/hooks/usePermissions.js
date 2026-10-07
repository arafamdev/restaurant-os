import { useQuery } from "@tanstack/react-query";

import { getPermissions } from "../services/employeeService";

export function usePermissions() {
  const {
    data: permissions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  return {
    permissions,
    isLoading,
    error,
  };
}
