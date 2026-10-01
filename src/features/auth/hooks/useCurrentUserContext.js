import { useQuery } from "@tanstack/react-query";

import useAuth from "./useAuth";

import { supabase } from "../../../services/supabase";

async function getCurrentUserContext() {
  const { data, error } = await supabase.rpc("get_current_user_context");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useCurrentUserContext() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    data: userContext,
    isLoading: isContextLoading,
    error,
  } = useQuery({
    queryKey: ["current-user-context", user?.id],
    queryFn: getCurrentUserContext,
    enabled: Boolean(user) && !isAuthLoading,
  });

  return {
    userContext,
    isLoading: isAuthLoading || isContextLoading,
    error,
  };
}
