import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { updateDailyMenuStatus } from "../services/dailyMenuService";

export function useToggleDailyMenu() {
  const queryClient = useQueryClient();

  const { mutate: toggleDailyMenu, isPending } = useMutation({
    mutationFn: ({ id, isActive }) => updateDailyMenuStatus(id, isActive),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dailyMenus"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dailyMenu", variables.id],
      });

      toast.success(
        variables.isActive
          ? "Daily menu activated successfully."
          : "Daily menu deactivated successfully.",
      );
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    toggleDailyMenu,
    isToggling: isPending,
  };
}
