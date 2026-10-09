import { useQuery } from "@tanstack/react-query";

import { useRestaurantContext } from "../../../context/useRestaurantContext";

import { getEmployees } from "../services/employeeService";

export function useEmployees() {
  const { restaurantId } = useRestaurantContext();

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees", restaurantId],
    queryFn: () => getEmployees(restaurantId),
    enabled: restaurantId !== null && restaurantId !== undefined,
  });

  return {
    employees,
    isLoading,
    error,
  };
}
