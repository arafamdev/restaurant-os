import { useQuery } from "@tanstack/react-query";

import useAuth from "./useAuth";

import { supabase } from "../../../services/supabase";

async function checkPermission(permissionName) {
  const { data, error } = await supabase.rpc("has_permission", {
    p_permission_name: permissionName,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function usePermission(permissionName) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    data: hasPermission,
    isLoading: isPermissionLoading,
    error,
  } = useQuery({
    queryKey: ["permission", permissionName, user?.id],
    queryFn: () => checkPermission(permissionName),
    enabled: Boolean(user) && Boolean(permissionName) && !isAuthLoading,
  });

  return {
    hasPermission: Boolean(hasPermission),
    isLoading: isAuthLoading || isPermissionLoading,
    error,
  };
}
