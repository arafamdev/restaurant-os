import { HiOutlineBeaker, HiOutlineCake } from "react-icons/hi2";

import MenuCategorySection from "./MenuCategorySection";

function MenuList({ menuItems, categories, onEdit, onToggleActive }) {
  const foodCategories = categories.filter(
    (category) => category.group_type === "food",
  );

  const drinkCategories = categories.filter(
    (category) => category.group_type === "drink",
  );

  const hasFoodItems = foodCategories.some((category) =>
    menuItems.some((item) => item.category_id === category.id),
  );

  const hasDrinkItems = drinkCategories.some((category) =>
    menuItems.some((item) => item.category_id === category.id),
  );

  return (
    <div className="space-y-10">
      {hasFoodItems && (
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <HiOutlineCake className="h-5 w-5 text-gray-500" />
            Foods
          </h2>

          <div className="space-y-6">
            {foodCategories.map((category) => (
              <MenuCategorySection
                key={category.id}
                category={category}
                menuItems={menuItems}
                onEdit={onEdit}
                onToggleActive={onToggleActive}
              />
            ))}
          </div>
        </section>
      )}

      {hasDrinkItems && (
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <HiOutlineBeaker className="h-5 w-5 text-gray-500" />
            Drinks
          </h2>

          <div className="space-y-6">
            {drinkCategories.map((category) => (
              <MenuCategorySection
                key={category.id}
                category={category}
                menuItems={menuItems}
                onEdit={onEdit}
                onToggleActive={onToggleActive}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MenuList;
