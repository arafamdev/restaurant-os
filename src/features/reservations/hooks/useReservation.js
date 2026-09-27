import { useQuery } from "@tanstack/react-query";

import { getReservation } from "../services/reservationService";

export function useReservation(id) {
  const {
    isLoading,
    data: reservation,
    error,
  } = useQuery({
    queryKey: ["reservation", id],
    queryFn: () => getReservation(id),
    enabled: Boolean(id),
  });

  return {
    isLoading,
    reservation,
    error,
  };
}
