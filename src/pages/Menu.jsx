import { useState } from "react";

import {
  HiOutlineBookOpen,
  HiOutlinePlus,
  HiOutlineSparkles,
} from "react-icons/hi2";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import ViewSwitcher from "../ui/ViewSwitcher";
import PageHeader from "../ui/PageHeader";

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

import { useHasPermission } from "../features/auth/hooks/useHasPermission";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";

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
    menuItems = [],
    error: itemsError,
  } = useMenuItems();

  const {
    isLoading: isLoadingCategories,
    categories = [],
    error: categoriesError,
  } = useMenuCategories();

  const { updateItem, isUpdating } = useUpdateMenuItem();

  const {
    hasPermission,
    isLoading: isPermissionLoading,
    error: permissionError,
  } = useHasPermission("manage_menu");

  const {
    userContext,
    isLoading: isUserContextLoading,
    error: userContextError,
  } = useCurrentUserContext();

  const isPlatformAdmin = Boolean(userContext?.is_platform_admin);
  const canManageMenu = isPlatformAdmin || hasPermission;

  const { filteredMenuItems } = useMenuFilters({
    menuItems,
    search,
    group,
    categoryId,
    status,
  });

  const isLoading =
    isLoadingItems ||
    isLoadingCategories ||
    isPermissionLoading ||
    isUserContextLoading;

  const error =
    itemsError || categoriesError || permissionError || userContextError;

  function handleGroupChange(nextGroup) {
    setGroup(nextGroup);
    setCategoryId("all");
  }

  function handleEdit(menuItem) {
    if (!canManageMenu) return;
    setSelectedMenuItem(menuItem);
  }

  function handleToggleActive(menuItem) {
    if (!canManageMenu) return;
    setMenuItemToToggle(menuItem);
  }

  function handleConfirmToggleActive() {
    if (!canManageMenu || !menuItemToToggle) return;

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

  function handleCloseEditModal() {
    if (!isUpdating) {
      setSelectedMenuItem(null);
    }
  }

  function handleCloseToggleModal() {
    if (!isUpdating) {
      setMenuItemToToggle(null);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <div className="min-h-full space-y-6 bg-gray-50/70 p-4 sm:p-6 dark:bg-[#0B1120]">
        {/* Cabeçalho */}

        <PageHeader
          icon={HiOutlineBookOpen}
          title="Menu"
          description={
            canManageMenu
              ? "Manage your restaurant menu."
              : "View your restaurant menu."
          }
          action={
            canManageMenu ? (
              <Button onClick={() => setIsCreating(true)}>
                <span className="flex items-center gap-2">
                  <HiOutlinePlus className="h-5 w-5" />
                  Add menu item
                </span>
              </Button>
            ) : null
          }
        />

        {/* Estatísticas */}
        <section className="rounded-2xl transition-shadow duration-300 hover:shadow-sm hover:shadow-gray-200/50 dark:hover:shadow-black/10">
          <MenuStats menuItems={menuItems} />
        </section>

        {/* Pesquisa e filtros */}
        <section className="relative rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md sm:p-5 dark:border-gray-800 dark:bg-[#111827] dark:hover:border-gray-700">
          <div className="mb-4 flex items-center gap-2">
            <HiOutlineSparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Search and filters
            </h2>
          </div>

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
        </section>

        {/* Organização e visualização */}
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-gray-800 dark:bg-[#111827] dark:hover:border-emerald-500/30">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Menu items
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Browse items by category and choose your preferred layout.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none">
              <MenuGroupSwitcher
                categories={categories}
                value={group}
                onChange={handleGroupChange}
              />
            </div>

            <div className="transition-all duration-200 hover:scale-[1.02] motion-reduce:transform-none">
              <ViewSwitcher value={view} onChange={setView} />
            </div>
          </div>
        </section>

        {/* Lista de pratos */}
        <section className="min-w-0">
          <MenuList
            menuItems={filteredMenuItems}
            categories={categories}
            group={group}
            view={view}
            onEdit={canManageMenu ? handleEdit : undefined}
            onToggleActive={canManageMenu ? handleToggleActive : undefined}
            canManage={canManageMenu}
          />
        </section>
      </div>

      {/* Modal de criação */}
      {canManageMenu && isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <div className="mb-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <HiOutlinePlus className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Create menu item
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a new item to your restaurant menu.
            </p>
          </div>

          <MenuItemForm onCloseModal={() => setIsCreating(false)} />
        </Modal>
      )}

      {/* Modal de edição */}
      {canManageMenu && selectedMenuItem && (
        <Modal onClose={handleCloseEditModal}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit menu item
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update this menu item.
            </p>
          </div>

          <MenuItemForm
            menuItemToEdit={selectedMenuItem}
            onCloseModal={() => setSelectedMenuItem(null)}
          />
        </Modal>
      )}

      {/* Modal de confirmação de estado */}
      {canManageMenu && menuItemToToggle && (
        <Modal onClose={handleCloseToggleModal}>
          <div className="text-gray-900 dark:text-gray-100">
            <h2 className="text-xl font-semibold">
              {menuItemToToggle.is_active
                ? "Deactivate menu item"
                : "Reactivate menu item"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Are you sure you want to{" "}
              {menuItemToToggle.is_active ? "deactivate" : "reactivate"}{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
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
