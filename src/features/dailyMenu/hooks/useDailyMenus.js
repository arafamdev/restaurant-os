import { useQuery } from "@tanstack/react-query";

import { useRestaurantContext } from "../../../context/useRestaurantContext";
import { getDailyMenus } from "../services/dailyMenuService";

export function useDailyMenus() {
  const { restaurantId } = useRestaurantContext();

  const {
    isLoading,
    data: dailyMenus = [],
    error,
  } = useQuery({
    queryKey: ["dailyMenus", restaurantId],
    queryFn: () => getDailyMenus(restaurantId),
    enabled: restaurantId !== null && restaurantId !== undefined,
  });

  return {
    isLoading,
    dailyMenus,
    error,
  };
}
