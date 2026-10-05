import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";

async function getMyProfile() {
  const { data, error } = await supabase.rpc("get_my_profile");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useProfile() {
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5,
  });

  return {
    profile,
    isLoading,
    error,
  };
}
