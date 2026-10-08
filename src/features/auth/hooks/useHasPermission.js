import { useQuery } from "@tanstack/react-query";

import useAuth from "./useAuth";

import { supabase } from "../../../services/supabase";

async function getHasPermission(permissionName, userId) {
  const { data, error } = await supabase.rpc("has_permission", {
    p_permission_name: permissionName,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useHasPermission(permissionName) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    data: hasPermission,
    isLoading: isPermissionLoading,
    error,
  } = useQuery({
    queryKey: ["has-permission", user?.id, permissionName],
    queryFn: () => getHasPermission(permissionName, user?.id),
    enabled: Boolean(user) && !isAuthLoading && Boolean(permissionName),
  });

  return {
    hasPermission: Boolean(hasPermission),
    isLoading: isAuthLoading || isPermissionLoading,
    error,
  };
}
