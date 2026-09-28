import { useQuery } from "@tanstack/react-query";

import { getDailyMenus } from "../services/dailyMenuService";

export function useDailyMenus() {
  const {
    isLoading,
    data: dailyMenus = [],
    error,
  } = useQuery({
    queryKey: ["dailyMenus"],
    queryFn: getDailyMenus,
  });

  return {
    isLoading,
    dailyMenus,
    error,
  };
}
