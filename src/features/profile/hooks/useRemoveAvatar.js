import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { removeProfileAvatar } from "../services/profileService";

export function useRemoveAvatar() {
  const queryClient = useQueryClient();

  const {
    mutate: removeAvatar,
    isPending,
    error,
  } = useMutation({
    mutationFn: removeProfileAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["current-user-context"],
      });

      queryClient.invalidateQueries({
        queryKey: ["avatar-url"],
      });

      toast.success("Avatar removed successfully!");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    removeAvatar,
    isPending,
    error,
  };
}
