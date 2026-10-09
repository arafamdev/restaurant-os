import { useQuery } from "@tanstack/react-query";
import { useRestaurantContext } from "../../../context/useRestaurantContext";
import { getTables } from "../services/tableService";

export function useTables() {
  const { restaurantId } = useRestaurantContext();

  const {
    isLoading,
    data: tables,
    error,
  } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: () => getTables(restaurantId),
    enabled: restaurantId !== null && restaurantId !== undefined,
  });

  return {
    isLoading,
    tables,
    error,
  };
}
