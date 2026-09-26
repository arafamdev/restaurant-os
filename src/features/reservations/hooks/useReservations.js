import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../services/reservationService";

export function useReservations() {
  const {
    isLoading,
    data: reservations,
    error,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: getReservations,
  });

  return {
    isLoading,
    reservations,
    error,
  };
}
