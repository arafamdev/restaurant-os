import { useQuery } from "@tanstack/react-query";
import { getAvatarUrl } from "../services/profileService";

export function useAvatarUrl(avatarPath) {
  const {
    data: avatarUrl,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["avatar-url", avatarPath],
    queryFn: () => getAvatarUrl(avatarPath),
    enabled: Boolean(avatarPath),
    staleTime: 1000 * 60 * 50,
  });

  return {
    avatarUrl,
    isLoading,
    error,
  };
}
