import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMenuItem } from "../services/menuService";

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, updatedMenuItem }) =>
      updateMenuItem(id, updatedMenuItem),

    onSuccess: () => {
      toast.success("Menu item updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    updateItem,
    isUpdating,
  };
}
