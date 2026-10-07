import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../services/supabase";

async function getHasPermission(permissionName) {
  const { data, error } = await supabase.rpc("has_permission", {
    p_permission_name: permissionName,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useHasPermission(permissionName) {
  const {
    data: hasPermission,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["has-permission", permissionName],
    queryFn: () => getHasPermission(permissionName),
    enabled: Boolean(permissionName),
  });

  return {
    hasPermission: Boolean(hasPermission),
    isLoading,
    error,
  };
}
