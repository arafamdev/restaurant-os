import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../services/profileService";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const {
    mutate: updateProfileData,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["currentUserContext"],
      });
    },
  });

  return {
    updateProfile: updateProfileData,
    isPending,
    error,
  };
}