import DailyMenuRow from "./DailyMenuRow";

function DailyMenuList({ dailyMenus, onEdit, onToggleActive, onDelete }) {
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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {dailyMenus.map((dailyMenu) => (
        <DailyMenuRow
          key={dailyMenu.id}
          dailyMenu={dailyMenu}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default DailyMenuList;
