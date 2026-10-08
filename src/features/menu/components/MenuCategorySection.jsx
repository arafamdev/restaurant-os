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

  // -------------------------------------------------
  // LIST VIEW
  // -------------------------------------------------

  if (view === "list") {
    return (
      <section>
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900">
            {category.name}
          </h3>

          {category.description && (
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {categoryItems.map((menuItem) => (
            <MenuCard
              key={menuItem.id}
              menuItem={menuItem}
              view="list"
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              canManage={canManage}
            />
          ))}
        </div>
      </section>
    );
  }

  // -------------------------------------------------
  // COMPACT VIEW
  // -------------------------------------------------

  if (view === "compact") {
    return (
      <section>
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900">
            {category.name}
          </h3>

          {category.description && (
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categoryItems.map((menuItem) => (
            <MenuCard
              key={menuItem.id}
              menuItem={menuItem}
              view="compact"
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              canManage={canManage}
            />
          ))}
        </div>
      </section>
    );
  }

  // -------------------------------------------------
  // LARGE VIEW
  // -------------------------------------------------

  return (
    <section>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          {category.name}
        </h3>

        {category.description && (
          <p className="mt-1 text-sm text-gray-500">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categoryItems.map((menuItem) => (
          <MenuCard
            key={menuItem.id}
            menuItem={menuItem}
            view="large"
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
