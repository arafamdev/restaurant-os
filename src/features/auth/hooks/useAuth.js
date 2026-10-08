import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getSession, signOut } from "../services/authService";

const AUTH_QUERY_KEY = ["auth"];

function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: session,
    isLoading,
    error,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getSession,
    staleTime: Infinity,
  });

  async function logout() {
    await signOut();

    queryClient.setQueryData(AUTH_QUERY_KEY, null);

    queryClient.removeQueries({
      queryKey: ["current-user-context"],
    });

    queryClient.removeQueries({
      queryKey: ["has-permission"],
    });
  }

  const user = session?.user ?? null;

  return {
    user,
    session: session ?? null,
    isLoading,
    error,
    logout,
    isAuthenticated: Boolean(user),
  };
}

export default useAuth;
