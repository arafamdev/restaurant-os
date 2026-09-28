import { useQuery } from "@tanstack/react-query";

import { getMenuItems } from "../services/menuService";

export function useMenuItems() {
  const {
    isLoading,
    data: menuItems = [],
    error,
  } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });

  return {
    isLoading,
    menuItems,
    error,
  };
}
