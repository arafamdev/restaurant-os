import { Controller, useWatch } from "react-hook-form";

import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";

import Button from "../../../ui/Button";
import Select from "../../../ui/Select";

import { useMenuItems } from "../../menu/hooks/useMenuItems";

const componentLabels = {
  starter: "Starter",
  main: "Main course",
  dessert: "Dessert",
};

function getMenuItemsByComponent(menuItems, componentType) {
  const categoryByComponent = {
    starter: "Starters",
    main: "Main Courses",
    dessert: "Desserts",
  };

  const categoryName = categoryByComponent[componentType];

  return menuItems.filter(
    (item) =>
      item.is_active &&
      item.is_available &&
      item.menu_categories?.name === categoryName,
  );
}

function DailyMenuOptionsField({
  control,
  fields,
  append,
  remove,
  menuType,
  restaurantId,
}) {
  const { menuItems, isLoading } = useMenuItems(restaurantId);

  const selectedOptions = useWatch({
    control,
    name: "options",
  });

  if (!restaurantId) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
        Select a restaurant first to load its menu items.
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading menu items...</p>;
  }

  if (menuItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
        No menu items found for this restaurant.
      </div>
    );
  }

  const componentTypes =
    menuType === "executive"
      ? ["starter", "main", "dessert"]
      : ["starter", "main"];

  const selectedMenuItemIds =
    selectedOptions?.map((option) => option?.menu_item_id).filter(Boolean) ??
    [];

  function getOptionsByComponent(componentType) {
    return fields
      .map((field, index) => ({
        field,
        index,
        option: selectedOptions?.[index],
      }))
      .filter(({ option }) => option?.component_type === componentType);
  }

  function getAvailableMenuItems(componentType, currentMenuItemId) {
    const componentMenuItems = getMenuItemsByComponent(
      menuItems,
      componentType,
    );

    return componentMenuItems.filter(
      (item) =>
        !selectedMenuItemIds.includes(String(item.id)) ||
        String(item.id) === String(currentMenuItemId),
    );
  }

  function handleAddOption(componentType) {
    append({
      component_type: componentType,
      menu_item_id: "",
    });
  }

  return (
    <div className="space-y-6">
      {componentTypes.map((componentType) => {
        const componentOptions = getOptionsByComponent(componentType);

        return (
          <div
            key={componentType}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {componentLabels[componentType]}
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  Select one or more options.
                </p>
              </div>

              <Button
                type="button"
                size="small"
                variation="secondary"
                onClick={() => handleAddOption(componentType)}
              >
                <HiOutlinePlus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {componentOptions.length === 0 && (
                <p className="rounded-lg border border-dashed border-gray-300 bg-white p-3 text-sm text-gray-500">
                  No {componentLabels[componentType].toLowerCase()} option
                  selected.
                </p>
              )}

              {componentOptions.map(({ field, index, option }) => {
                const availableMenuItems = getAvailableMenuItems(
                  componentType,
                  option?.menu_item_id,
                );

                const menuItemOptions = availableMenuItems.map((item) => ({
                  value: String(item.id),
                  label: `${item.name} — €${Number(item.price).toFixed(2)}`,
                }));

                return (
                  <div key={field.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <Controller
                        name={`options.${index}.menu_item_id`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              {
                                value: "",
                                label: "Select a menu item",
                              },
                              ...menuItemOptions,
                            ]}
                          />
                        )}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${componentLabels[
                        componentType
                      ].toLowerCase()} option`}
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DailyMenuOptionsField;
