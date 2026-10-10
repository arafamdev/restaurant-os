import MenuCard from "./MenuCard";

function MenuCategorySection({
  category,
  menuItems,
  view = "compact",
  onEdit,
  onToggleActive,
  canManage = false,
}) {
  const categoryItems = menuItems.filter(
    (item) => item.category_id === category.id,
  );

  if (categoryItems.length === 0) {
    return null;
  }

  const isListView = view === "list";
  const isCompactView = view === "compact";

  const gridClasses = isCompactView
    ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
    : "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3";

  return (
    <section>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {category.name}
        </h3>

        {category.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {category.description}
          </p>
        )}
      </div>

      <div
        className={
          isListView
            ? "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#1F2937]"
            : gridClasses
        }
      >
        {categoryItems.map((menuItem) => (
          <MenuCard
            key={menuItem.id}
            menuItem={menuItem}
            view={view}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
            canManage={canManage}
          />
        ))}
      </div>
    </section>
  );
}

export default MenuCategorySection;
