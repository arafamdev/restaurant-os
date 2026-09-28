import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { closeRestaurantDay } from "../services/restaurantDayService";

export function useCloseRestaurantDay() {
  const queryClient = useQueryClient();

  const { mutate: closeRestaurantDayMutation, isPending } = useMutation({
    mutationFn: closeRestaurantDay,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurantDay"],
      });

      toast.success("Restaurant Day closed successfully.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    closeRestaurantDay: closeRestaurantDayMutation,
    isClosing: isPending,
  };
}
