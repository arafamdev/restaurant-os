import { useQuery } from "@tanstack/react-query";

import { useRestaurantContext } from "../../../context/useRestaurantContext";
import { getMenuItems } from "../services/menuService";

export function useMenuItems(restaurantIdOverride = undefined) {
  const { restaurantId: contextRestaurantId } = useRestaurantContext();

  const restaurantId =
    restaurantIdOverride !== undefined
      ? restaurantIdOverride
      : contextRestaurantId;

  const {
    isLoading,
    data: menuItems = [],
    error,
  } = useQuery({
    queryKey: ["menuItems", restaurantId],
    queryFn: () => getMenuItems(restaurantId),
    enabled:
      restaurantId !== null &&
      restaurantId !== undefined &&
      restaurantId !== "",
  });

  return {
    isLoading,
    menuItems,
    error,
  };
}
