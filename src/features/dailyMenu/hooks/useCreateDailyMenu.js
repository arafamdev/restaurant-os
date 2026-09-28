import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createDailyMenu } from "../services/dailyMenuService";

export function useCreateDailyMenu() {
  const queryClient = useQueryClient();

  const { mutate: createDailyMenuMutation, isPending } = useMutation({
    mutationFn: createDailyMenu,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dailyMenus"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dailyMenuOptions"],
      });

      toast.success("Daily menu created successfully.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createDailyMenu: createDailyMenuMutation,
    isCreating: isPending,
  };
}
