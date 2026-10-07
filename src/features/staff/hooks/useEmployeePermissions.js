import { useQuery } from "@tanstack/react-query";

import {
  getEmployeeEffectivePermissions,
  getEmployeePermissions,
} from "../services/employeeService";

export function useEmployeePermissions(employeeId) {
  const normalizedEmployeeId = Number(employeeId);

  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    error: permissionsError,
  } = useQuery({
    queryKey: ["employee-permissions", normalizedEmployeeId],
    queryFn: () => getEmployeePermissions(normalizedEmployeeId),
    enabled: Number.isFinite(normalizedEmployeeId),
  });

  const {
    data: effectivePermissions,
    isLoading: isEffectivePermissionsLoading,
    error: effectivePermissionsError,
  } = useQuery({
    queryKey: ["employee-effective-permissions", normalizedEmployeeId],
    queryFn: () => getEmployeeEffectivePermissions(normalizedEmployeeId),
    enabled: Number.isFinite(normalizedEmployeeId),
  });

  return {
    permissions,
    effectivePermissions,
    isPermissionsLoading,
    isEffectivePermissionsLoading,
    permissionsError,
    effectivePermissionsError,
  };
}
