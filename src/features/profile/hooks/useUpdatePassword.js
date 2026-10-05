import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updatePassword } from "../services/profileService";

export function useUpdatePassword() {
  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: updatePassword,

    onSuccess: () => {
      toast.success("Password updated successfully.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    changePassword,
    isPending,
  };
}
