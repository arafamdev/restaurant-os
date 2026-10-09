import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../services/restaurantService";

export function useRestaurants() {
  const {
    data: restaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  return {
    restaurants,
    isLoading,
    error,
  };
}