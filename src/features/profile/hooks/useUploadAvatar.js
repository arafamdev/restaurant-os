import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadAvatar, updateProfile } from "../services/profileService";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  const {
    mutate: upload,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ userId, file, profile }) => {
      if (!userId) {
        throw new Error("User ID is required.");
      }

      if (!file) {
        throw new Error("Avatar file is required.");
      }

      if (!profile) {
        throw new Error("Profile information is required.");
      }

      const avatarPath = await uploadAvatar(userId, file);

      await updateProfile({
        fullName: profile.full_name,
        phone: profile.phone,
        avatarPath,
      });

      return avatarPath;
    },

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

      toast.success("Avatar uploaded successfully!");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    uploadAvatar: upload,
    isPending,
    error,
  };
}
