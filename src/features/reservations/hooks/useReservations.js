import { useQuery } from "@tanstack/react-query";

import { useRestaurantContext } from "../../../context/useRestaurantContext";

import { getReservations } from "../services/reservationService";

export function useReservations() {
  const { restaurantId } = useRestaurantContext();

  const {
    isLoading,
    data: reservations,
    error,
  } = useQuery({
    queryKey: ["reservations", restaurantId],
    queryFn: () => getReservations(restaurantId),
    enabled: restaurantId !== null && restaurantId !== undefined,
  });

  return {
    isLoading,
    reservations,
    error,
  };
}
