import { useQuery } from "@tanstack/react-query";

import { useRestaurantContext } from "../../../context/useRestaurantContext";
import { getMenuCategories } from "../services/menuService";

export function useMenuCategories(restaurantIdOverride = undefined) {
  const { restaurantId: contextRestaurantId } = useRestaurantContext();

  const restaurantId =
    restaurantIdOverride !== undefined
      ? restaurantIdOverride
      : contextRestaurantId;

  const {
    isLoading,
    data: categories = [],
    error,
  } = useQuery({
    queryKey: ["menuCategories", restaurantId],
    queryFn: () => getMenuCategories(restaurantId),
    enabled:
      restaurantId !== null &&
      restaurantId !== undefined &&
      restaurantId !== "",
  });

  return {
    isLoading,
    categories,
    error,
  };
}
