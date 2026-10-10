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
    (accumulator, item) => {
      const groupType = item.menu_categories?.group_type;

      accumulator.total += 1;

      if (groupType) {
        accumulator.groups[groupType] =
          (accumulator.groups[groupType] || 0) + 1;
      }

      return accumulator;
    },
    {
      total: 0,
      groups: {},
    },
  );

  const groupStats = Object.entries(stats.groups);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {" "}
      <StatCard label="Total" value={stats.total} icon={HiOutlineSquares2X2} />
      {groupStats.map(([groupType, count]) => {
        const config = GROUP_CONFIG[groupType];
        const label = config?.label || formatGroupLabel(groupType);
        const Icon = config?.icon || HiOutlineSquares2X2;

        return (
          <StatCard key={groupType} label={label} value={count} icon={Icon} />
        );
      })}
    </section>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-gray-200/50 motion-reduce:transform-none motion-reduce:transition-none sm:p-5 dark:border-gray-800 dark:bg-[#111827] dark:hover:border-emerald-500/40 dark:hover:shadow-black/20">
      {" "}
      <div className="flex items-center justify-between gap-3">
        {" "}
        <div className="min-w-0">
          {" "}
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}{" "}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none dark:bg-gray-800 dark:text-gray-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-emerald-500 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
    </article>
  );
}

export default MenuStats;
