import { supabase } from "../../../services/supabase";

const AUTH_QUERY_KEY = ["auth"];
const CURRENT_USER_CONTEXT_QUERY_KEY = ["current-user-context"];

export function setupAuthQuerySync(queryClient) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    switch (event) {
      case "INITIAL_SESSION":
      case "SIGNED_IN":
      case "TOKEN_REFRESHED":
      case "USER_UPDATED":
        queryClient.setQueryData(AUTH_QUERY_KEY, session);
        break;

      case "SIGNED_OUT":
        queryClient.setQueryData(AUTH_QUERY_KEY, null);

        queryClient.removeQueries({
          queryKey: CURRENT_USER_CONTEXT_QUERY_KEY,
        });

        break;

      default:
        break;
    }
  });

  return () => subscription.unsubscribe();
}
