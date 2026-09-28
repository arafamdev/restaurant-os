import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { openRestaurantDay } from "../services/restaurantDayService";

export function useOpenRestaurantDay() {
  const queryClient = useQueryClient();

  const { mutate: openRestaurantDayMutation, isPending } = useMutation({
    // Função que executa a abertura do Restaurant Day
    // através da RPC do Supabase.
    mutationFn: openRestaurantDay,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurantDay"],
      });

      toast.success("Restaurant Day opened successfully.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    openRestaurantDay: openRestaurantDayMutation,
    isOpening: isPending,
  };
}
