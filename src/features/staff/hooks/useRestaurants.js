import { useQuery } from "@tanstack/react-query";

import { getRestaurants } from "../services/employeeService";

export function useRestaurants() {
  const {
    isLoading,
    data: restaurants,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  return {
    isLoading,
    restaurants,
    error,
  };
}
