import { useQuery } from "@tanstack/react-query";

import { getDailyMenuById } from "../services/dailyMenuService";

export function useDailyMenu(id) {
  const {
    isLoading,
    data: dailyMenu,
    error,
  } = useQuery({
    queryKey: ["dailyMenu", id],
    queryFn: () => getDailyMenuById(id),
    enabled: Boolean(id),
  });

  return {
    isLoading,
    dailyMenu,
    error,
  };
}
