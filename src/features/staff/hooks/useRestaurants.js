import { useQuery } from "@tanstack/react-query";

import { getRestaurants } from "../services/employeeService";

export function useRestaurants(enabled = true) {
  const {
    isLoading,
    data: restaurants,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
    enabled,
  });

  return {
    isLoading,
    restaurants,
    error,
  };
}
