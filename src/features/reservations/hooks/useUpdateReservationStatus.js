import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { updateReservationStatus } from "../services/reservationService";

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ id, status }) => updateReservationStatus(id, status),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", String(data.id)],
      });

      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });

      toast.success("Reservation status updated.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    updateStatus,
    isUpdating: isPending,
  };
}
