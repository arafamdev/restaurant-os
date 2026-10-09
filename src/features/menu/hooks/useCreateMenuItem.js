import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { createMenuItem } from "../services/menuService";

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  const { mutate: createItem, isPending: isCreating } = useMutation({
    mutationFn: createMenuItem,

    onSuccess: () => {
      toast.success("Menu item created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createItem,
    isCreating,
  };
}
