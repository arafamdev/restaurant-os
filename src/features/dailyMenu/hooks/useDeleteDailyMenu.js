import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteDailyMenu } from "../services/dailyMenuService";

export function useDeleteDailyMenu() {
  const queryClient = useQueryClient();

  const { mutate: deleteDailyMenuMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteDailyMenu,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dailyMenus"],
        });

        queryClient.invalidateQueries({
          queryKey: ["dailyMenuOptions"],
        });

        toast.success("Daily menu deleted successfully.");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });

  return {
    deleteDailyMenu: deleteDailyMenuMutation,
    isDeleting,
  };
}
