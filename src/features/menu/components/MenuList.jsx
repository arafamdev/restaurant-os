import {
  HiOutlineBeaker,
  HiOutlineCake,
  HiOutlineSparkles,
} from "react-icons/hi2";

import MenuCategorySection from "./MenuCategorySection";

const GROUP_CONFIG = {
  food: {
    label: "Food",
    icon: HiOutlineCake,
  },

  drink: {
    label: "Drinks",
    icon: HiOutlineBeaker,
  },

  coffee: {
    label: "Coffee",
    icon: HiOutlineSparkles,
  },

  dessert: {
    label: "Desserts",
    icon: HiOutlineSparkles,
  },
};

function getGroupConfig(groupType) {
  return (
    GROUP_CONFIG[groupType] || {
      label: groupType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()),
      icon: HiOutlineSparkles,
    }
  );
}

function MenuList({
  menuItems,
  categories,
  group,
  view = "compact",
  onEdit,
  onToggleActive,
}) {
  const visibleGroups = [
    ...new Set(
      categories
        .map((category) => category.group_type)
        .filter(Boolean)
        .filter((groupType) => group === "all" || groupType === group),
    ),
  ];

  const groupsWithItems = visibleGroups.filter((groupType) => {
    const groupCategories = categories.filter(
      (category) => category.group_type === groupType,
    );

    return groupCategories.some((category) =>
      menuItems.some((item) => item.category_id === category.id),
    );
  });

  if (menuItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-gray-700">No menu items found</p>

        <p className="mt-1 text-sm text-gray-400">
          Try changing your filters or add a new menu item.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* BADGE LEGEND */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Green badges: dietary attributes
        </span>

        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Amber badges: allergens
        </span>
      </div>

      {groupsWithItems.map((groupType) => {
        const { label, icon: Icon } = getGroupConfig(groupType);

        const groupCategories = categories.filter(
          (category) => category.group_type === groupType,
        );

        return (
          <section key={groupType}>
            <div className="mb-5 flex items-center gap-2">
              <Icon className="h-5 w-5 text-gray-500" />

              <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
            </div>

            <div className="space-y-6">
              {groupCategories.map((category) => (
                <MenuCategorySection
                  key={category.id}
                  category={category}
                  menuItems={menuItems}
                  view={view}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default MenuList;
