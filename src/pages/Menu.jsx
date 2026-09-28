import { useState } from "react";

import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

import { useMenuItems } from "../features/menu/hooks/useMenuItems";
import { useMenuCategories } from "../features/menu/hooks/useMenuCategories";

import MenuList from "../features/menu/components/MenuList";
import MenuFilters from "../features/menu/components/MenuFilters";

function Menu() {
  const [group, setGroup] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState("all");

  const {
    isLoading: isLoadingItems,
    menuItems,
    error: itemsError,
  } = useMenuItems();

  const {
    isLoading: isLoadingCategories,
    categories,
    error: categoriesError,
  } = useMenuCategories();

  const isLoading = isLoadingItems || isLoadingCategories;

  const error = itemsError || categoriesError;

  if (isLoading) return <Spinner />;

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesGroup =
      group === "all" || item.menu_categories?.group_type === group;

    const matchesCategory =
      categoryId === "all" || String(item.category_id) === categoryId;

    const matchesStatus =
      status === "all" ||
      (status === "available" && item.is_active && item.is_available) ||
      (status === "unavailable" && item.is_active && !item.is_available) ||
      (status === "inactive" && !item.is_active);

    return matchesGroup && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Menu</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage restaurant menu items and categories.
        </p>
      </div>

      <MenuFilters
        group={group}
        categoryId={categoryId}
        status={status}
        categories={categories}
        onGroupChange={setGroup}
        onCategoryChange={setCategoryId}
        onStatusChange={setStatus}
      />

      <MenuList menuItems={filteredMenuItems} categories={categories} />
    </div>
  );
}

export default Menu;
