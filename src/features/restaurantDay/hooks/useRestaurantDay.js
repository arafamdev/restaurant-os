import { useQuery } from "@tanstack/react-query";

import {
  getActiveRestaurantDay,
  getLatestRestaurantDay,
} from "../services/restaurantDayService";

export function useRestaurantDay() {
  const {
    isLoading: isLoadingActiveDay,
    data: restaurantDay,
    error: activeDayError,
  } = useQuery({
    queryKey: ["restaurantDay", "active"],
    queryFn: getActiveRestaurantDay,
  });

  const {
    isLoading: isLoadingLatestDay,
    data: latestRestaurantDay,
    error: latestDayError,
  } = useQuery({
    queryKey: ["restaurantDay", "latest"],
    queryFn: getLatestRestaurantDay,
  });

  return {
    isLoading: isLoadingActiveDay || isLoadingLatestDay,
    restaurantDay,
    latestRestaurantDay,
    error: activeDayError || latestDayError,
  };
}
