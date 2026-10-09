import { useState } from "react";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import ViewSwitcher from "../ui/ViewSwitcher";
import useViewMode from "../hooks/useViewMode";

import DailyMenuForm from "../features/dailyMenu/components/DailyMenuForm";
import DailyMenuList from "../features/dailyMenu/components/DailyMenuList";
import DailyMenuStatusModal from "../features/dailyMenu/components/DailyMenuStatusModal";

import { useDeleteDailyMenu } from "../features/dailyMenu/hooks/useDeleteDailyMenu";
import { useDailyMenus } from "../features/dailyMenu/hooks/useDailyMenus";
import { useToggleDailyMenu } from "../features/dailyMenu/hooks/useToggleDailyMenu";

import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";
import { useHasPermission } from "../features/auth/hooks/useHasPermission";

function DailyMenu() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingDailyMenu, setEditingDailyMenu] = useState(null);
  const [dailyMenuToToggle, setDailyMenuToToggle] = useState(null);
  const [deletingDailyMenu, setDeletingDailyMenu] = useState(null);

  const [view, setView] = useViewMode("daily-menu");

  const {
    dailyMenus,
    isLoading: isLoadingDailyMenus,
    error: dailyMenusError,
  } = useDailyMenus();

  const { toggleDailyMenu, isToggling } = useToggleDailyMenu();

  const { deleteDailyMenu, isDeleting } = useDeleteDailyMenu();

  const { userContext, isLoading: isUserLoading } = useCurrentUserContext();

  const {
    hasPermission,
    isLoading: isPermissionLoading,
    error: permissionError,
  } = useHasPermission("manage_menu");

  const isPlatformAdmin = Boolean(userContext?.is_platform_admin);

  const canManageMenu = isPlatformAdmin || hasPermission;

  function handleToggleActive(dailyMenu) {
    if (!canManageMenu) return;

    setDailyMenuToToggle(dailyMenu);
  }

  function handleDeleteDailyMenu(dailyMenu) {
    if (!canManageMenu) return;

    setDeletingDailyMenu(dailyMenu);
  }

  function handleEditDailyMenu(dailyMenu) {
    if (!canManageMenu) return;

    setEditingDailyMenu(dailyMenu);
  }

  function handleConfirmToggle() {
    if (!canManageMenu || !dailyMenuToToggle) return;

    toggleDailyMenu(
      {
        id: dailyMenuToToggle.id,
        isActive: !dailyMenuToToggle.is_active,
      },
      {
        onSuccess: () => {
          setDailyMenuToToggle(null);
        },
      },
    );
  }

  const isLoading = isLoadingDailyMenus || isPermissionLoading || isUserLoading;

  const error = dailyMenusError || permissionError;

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Daily Menu</h1>

            <p className="mt-1 text-sm text-gray-500">
              {canManageMenu
                ? "Manage your daily menu offers."
                : "View your daily menu offers."}
            </p>
          </div>

          {canManageMenu && (
            <Button onClick={() => setIsCreating(true)}>
              Create daily menu
            </Button>
          )}
        </div>

        {/* View */}

        <div className="flex justify-end">
          <ViewSwitcher value={view} onChange={setView} />
        </div>

        {/* List */}

        <DailyMenuList
          dailyMenus={dailyMenus}
          view={view}
          onEdit={canManageMenu ? handleEditDailyMenu : undefined}
          onToggleActive={canManageMenu ? handleToggleActive : undefined}
          onDelete={canManageMenu ? handleDeleteDailyMenu : undefined}
          canManage={canManageMenu}
        />
      </div>

      {/* Create */}

      {canManageMenu && isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create daily menu
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new daily menu offer.
            </p>
          </div>

          <DailyMenuForm onCloseModal={() => setIsCreating(false)} />
        </Modal>
      )}

      {/* Edit */}

      {canManageMenu && editingDailyMenu && (
        <Modal onClose={() => setEditingDailyMenu(null)}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit daily menu
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update this daily menu offer.
            </p>
          </div>

          <DailyMenuForm
            dailyMenu={editingDailyMenu}
            onCloseModal={() => setEditingDailyMenu(null)}
          />
        </Modal>
      )}

      {/* Delete */}

      {canManageMenu && deletingDailyMenu && (
        <Modal
          onClose={() => {
            if (!isDeleting) {
              setDeletingDailyMenu(null);
            }
          }}
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Delete daily menu?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <strong>{deletingDailyMenu.name}</strong>?
            </p>

            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variation="secondary"
                onClick={() => setDeletingDailyMenu(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variation="danger"
                onClick={() => {
                  deleteDailyMenu(deletingDailyMenu.id, {
                    onSuccess: () => {
                      setDeletingDailyMenu(null);
                    },
                  });
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toggle status */}

      {canManageMenu && dailyMenuToToggle && (
        <DailyMenuStatusModal
          dailyMenu={dailyMenuToToggle}
          onClose={() => setDailyMenuToToggle(null)}
          onConfirm={handleConfirmToggle}
          isProcessing={isToggling}
        />
      )}
    </>
  );
}

export default DailyMenu;
