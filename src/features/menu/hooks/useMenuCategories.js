import { useQuery } from "@tanstack/react-query";

import { useRestaurantContext } from "../../../context/useRestaurantContext";

import { getMenuCategories } from "../services/menuService";

export function useMenuCategories() {
  const { restaurantId } = useRestaurantContext();

  const {
    isLoading,
    data: categories = [],
    error,
  } = useQuery({
    queryKey: ["menuCategories", restaurantId],
    queryFn: () => getMenuCategories(restaurantId),
    enabled: restaurantId !== null && restaurantId !== undefined,
  });

  return {
    isLoading,
    categories,
    error,
  };
}
