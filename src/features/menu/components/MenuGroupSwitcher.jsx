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

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full rounded-xl border border-gray-200 bg-gray-50 p-1 sm:min-w-0">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
            value === "all"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
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
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
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
