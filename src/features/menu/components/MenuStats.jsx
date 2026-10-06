import {
  HiOutlineBeaker,
  HiOutlineCake,
  HiOutlineSquares2X2,
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
};

function formatGroupLabel(group) {
  return group
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function MenuStats({ menuItems }) {
  const stats = menuItems.reduce(
    (acc, item) => {
      const groupType = item.menu_categories?.group_type;

      acc.total += 1;

      if (groupType) {
        acc.groups[groupType] = (acc.groups[groupType] || 0) + 1;
      }

      return acc;
    },
    {
      total: 0,
      groups: {},
    },
  );

  const groupStats = Object.entries(stats.groups);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Total" value={stats.total} icon={HiOutlineSquares2X2} />

      {groupStats.map(([groupType, count]) => {
        const config = GROUP_CONFIG[groupType];

        const label = config?.label || formatGroupLabel(groupType);
        const Icon = config?.icon || HiOutlineSquares2X2;

        return (
          <StatCard key={groupType} label={label} value={count} icon={Icon} />
        );
      })}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

export default MenuStats;
