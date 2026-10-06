import { useMemo } from "react";

function useMenuFilters({ menuItems = [], search, group, categoryId, status }) {
  const filteredMenuItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesSearch =
        normalizedSearch === "" ||
        item.name?.toLowerCase().includes(normalizedSearch) ||
        item.description?.toLowerCase().includes(normalizedSearch);

      const matchesGroup =
        group === "all" || item.menu_categories?.group_type === group;

      const matchesCategory =
        categoryId === "all" || String(item.category_id) === categoryId;

      const matchesStatus =
        status === "all" ||
        (status === "available" && item.is_active && item.is_available) ||
        (status === "unavailable" && item.is_active && !item.is_available) ||
        (status === "inactive" && !item.is_active);

      return matchesSearch && matchesGroup && matchesCategory && matchesStatus;
    });
  }, [menuItems, search, group, categoryId, status]);

  return {
    filteredMenuItems,
  };
}

export default useMenuFilters;
