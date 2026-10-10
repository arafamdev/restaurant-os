import {
  HiOutlineBeaker,
  HiOutlineCake,
  HiOutlineSparkles,
} from "react-icons/hi2";

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

function MenuGroupSwitcher({ categories, value, onChange }) {
  const groups = [
    ...new Set(
      categories.map((category) => category.group_type).filter(Boolean),
    ),
  ];

  const baseClasses =
    "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors";

  function getButtonClasses(isActive) {
    return isActive
      ? `${baseClasses} bg-white text-gray-950 shadow-sm dark:bg-gray-700 dark:text-gray-100`
      : `${baseClasses} text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100`;
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full rounded-xl border border-gray-200 bg-gray-50 p-1 sm:min-w-0 dark:border-gray-700 dark:bg-[#111827]">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={getButtonClasses(value === "all")}
        >
          All
        </button>

        {groups.map((group) => {
          const { label, icon: Icon } = getGroupConfig(group);
          const isActive = value === group;

          return (
            <button
              key={group}
              type="button"
              onClick={() => onChange(group)}
              className={`${getButtonClasses(isActive)} inline-flex items-center gap-1.5`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MenuGroupSwitcher;
