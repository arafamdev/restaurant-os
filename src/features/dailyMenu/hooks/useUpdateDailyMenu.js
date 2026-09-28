import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateDailyMenu } from "../services/dailyMenuService";

export function useUpdateDailyMenu() {
  const queryClient = useQueryClient();

  const { mutate: updateDailyMenuMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: updateDailyMenu,

      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["dailyMenus"],
        });

        queryClient.invalidateQueries({
          queryKey: ["dailyMenuOptions"],
        });

        queryClient.invalidateQueries({
          queryKey: ["dailyMenu", variables.id],
        });

        toast.success("Daily menu updated successfully.");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });

  return {
    updateDailyMenu: updateDailyMenuMutation,
    isUpdating,
  };
}
