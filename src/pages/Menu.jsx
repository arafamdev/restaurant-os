import { useState } from "react";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import ViewSwitcher from "../ui/ViewSwitcher";

import useViewMode from "../hooks/useViewMode";

import { useMenuItems } from "../features/menu/hooks/useMenuItems";

import { useMenuCategories } from "../features/menu/hooks/useMenuCategories";

import { useUpdateMenuItem } from "../features/menu/hooks/useUpdateMenuItem";

import useMenuFilters from "../features/menu/hooks/useMenuFilters";

import MenuFilters from "../features/menu/components/MenuFilters";
import MenuGroupSwitcher from "../features/menu/components/MenuGroupSwitcher";
import MenuList from "../features/menu/components/MenuList";
import MenuItemForm from "../features/menu/components/MenuItemForm";
import MenuStats from "../features/menu/components/MenuStats";

function Menu() {
  const [group, setGroup] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [view, setView] = useViewMode("menu");

  const [isCreating, setIsCreating] = useState(false);

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [menuItemToToggle, setMenuItemToToggle] = useState(null);

  const {
    isLoading: isLoadingItems,
    menuItems,
    error: itemsError,
  } = useMenuItems();

  const {
    isLoading: isLoadingCategories,
    categories,
    error: categoriesError,
  } = useMenuCategories();

  const { updateItem, isUpdating } = useUpdateMenuItem();

  const { filteredMenuItems } = useMenuFilters({
    menuItems,
    search,
    group,
    categoryId,
    status,
  });

  const isLoading = isLoadingItems || isLoadingCategories;

  const error = itemsError || categoriesError;

  function handleGroupChange(nextGroup) {
    setGroup(nextGroup);

    // A categoria selecionada pode pertencer
    // ao grupo anterior.
    setCategoryId("all");
  }

  function handleEdit(menuItem) {
    setSelectedMenuItem(menuItem);
  }

  function handleToggleActive(menuItem) {
    setMenuItemToToggle(menuItem);
  }

  function handleConfirmToggleActive() {
    if (!menuItemToToggle) return;

    const nextIsActive = !menuItemToToggle.is_active;

    updateItem(
      {
        id: menuItemToToggle.id,
        updatedMenuItem: {
          is_active: nextIsActive,
        },
      },
      {
        onSuccess: () => {
          setMenuItemToToggle(null);
        },
      },
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mt-1 text-xl text-gray-500">
              Manage your restaurant menu.
            </p>
          </div>

          <Button onClick={() => setIsCreating(true)}>Add menu item</Button>
        </div>

        {/* Menu statistics */}
        <MenuStats menuItems={menuItems} />

        {/* Search and filters */}
        <MenuFilters
          search={search}
          group={group}
          categoryId={categoryId}
          status={status}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryId}
          onStatusChange={setStatus}
        />

        {/* Group and view controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <MenuGroupSwitcher
            categories={categories}
            value={group}
            onChange={handleGroupChange}
          />

          <ViewSwitcher value={view} onChange={setView} />
        </div>

        {/* Menu list */}
        <MenuList
          menuItems={filteredMenuItems}
          categories={categories}
          group={group}
          view={view}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
        />
      </div>

      {/* Create menu item modal */}
      {isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create menu item
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new item to your restaurant menu.
            </p>
          </div>

          <MenuItemForm onCloseModal={() => setIsCreating(false)} />
        </Modal>
      )}

      {/* Edit menu item modal */}
      {selectedMenuItem && (
        <Modal
          onClose={() => {
            if (!isUpdating) {
              setSelectedMenuItem(null);
            }
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit menu item
            </h2>

            <p className="mt-1 text-sm text-gray-500">Update this menu item.</p>
          </div>

          <MenuItemForm
            menuItemToEdit={selectedMenuItem}
            onCloseModal={() => setSelectedMenuItem(null)}
          />
        </Modal>
      )}

      {/* Deactivate / Reactivate confirmation */}
      {menuItemToToggle && (
        <Modal
          onClose={() => {
            if (!isUpdating) {
              setMenuItemToToggle(null);
            }
          }}
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {menuItemToToggle.is_active
                ? "Deactivate menu item"
                : "Reactivate menu item"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to{" "}
              {menuItemToToggle.is_active ? "deactivate" : "reactivate"}{" "}
              <span className="font-medium text-gray-900">
                {menuItemToToggle.name}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variation="secondary"
                disabled={isUpdating}
                onClick={() => setMenuItemToToggle(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variation={menuItemToToggle.is_active ? "danger" : "primary"}
                disabled={isUpdating}
                onClick={handleConfirmToggleActive}
              >
                {isUpdating
                  ? "Updating..."
                  : menuItemToToggle.is_active
                    ? "Deactivate"
                    : "Reactivate"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Menu;
