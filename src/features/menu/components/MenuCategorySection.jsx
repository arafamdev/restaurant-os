import MenuRow from "./MenuRow";

function MenuCategorySection({ category, menuItems }) {
  const categoryItems = menuItems.filter(
    (item) => item.category_id === category.id,
  );

  if (categoryItems.length === 0) {
    return null;
  }

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
          <MenuRow key={menuItem.id} menuItem={menuItem} />
        ))}
      </div>
    </section>
  );
}

export default MenuCategorySection;
