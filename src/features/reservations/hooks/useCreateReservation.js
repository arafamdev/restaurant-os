import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createReservation } from "../services/reservationService";

export function useCreateReservation() {
  const queryClient = useQueryClient();

  const { mutate: createReservationMutation, isPending } = useMutation({
    mutationFn: createReservation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });

      toast.success("Reservation created successfully.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createReservation: createReservationMutation,
    isCreating: isPending,
  };
}
