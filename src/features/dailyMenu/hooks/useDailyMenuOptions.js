import { useQuery } from "@tanstack/react-query";

import { getDailyMenuOptions } from "../services/dailyMenuService";

export function useDailyMenuOptions() {
  const {
    isLoading,
    data: dailyMenuOptions = [],
    error,
  } = useQuery({
    queryKey: ["dailyMenuOptions"],
    queryFn: getDailyMenuOptions,
  });

  return {
    isLoading,
    dailyMenuOptions,
    error,
  };
}
