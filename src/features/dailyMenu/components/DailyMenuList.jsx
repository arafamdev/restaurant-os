import DailyMenuCard from "./DailyMenuCard";

function DailyMenuList({ dailyMenus, view, onEdit, onToggleActive, onDelete }) {
  if (dailyMenus.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <h3 className="text-base font-semibold text-gray-900">
          No daily menus yet
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Create your first daily menu offer.
        </p>
      </div>
    );
  }

  const isListView = view === "list";

  return (
    <div
      className={
        isListView
          ? "overflow-hidden rounded-xl border border-gray-200 bg-white"
          : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {dailyMenus.map((dailyMenu) => (
        <DailyMenuCard
          key={dailyMenu.id}
          dailyMenu={dailyMenu}
          view={view}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default DailyMenuList;
