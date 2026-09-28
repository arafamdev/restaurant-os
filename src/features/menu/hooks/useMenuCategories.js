import { useQuery } from "@tanstack/react-query";

import { getMenuCategories } from "../services/menuService";

export function useMenuCategories() {
  const {
    isLoading,
    data: categories = [],
    error,
  } = useQuery({
    queryKey: ["menuCategories"],
    queryFn: getMenuCategories,
  });

  return {
    isLoading,
    categories,
    error,
  };
}
