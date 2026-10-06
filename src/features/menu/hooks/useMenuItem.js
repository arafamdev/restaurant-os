import { useQuery } from "@tanstack/react-query";

import { getMenuItemById } from "../services/menuService";

function useMenuItem(id) {
  const {
    data: menuItem,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menu-item", id],
    queryFn: () => getMenuItemById(id),
    enabled: Boolean(id),
  });

  return {
    menuItem,
    isLoading,
    error,
  };
}

export default useMenuItem;
