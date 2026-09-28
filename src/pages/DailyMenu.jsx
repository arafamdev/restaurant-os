import { useState } from "react";

import Button from "../ui/Button";
import Modal from "../ui/Modal";

import DailyMenuForm from "../features/dailyMenu/components/DailyMenuForm";
import DailyMenuList from "../features/dailyMenu/components/DailyMenuList";
import DailyMenuStatusModal from "../features/dailyMenu/components/DailyMenuStatusModal";
import { useDeleteDailyMenu } from "../features/dailyMenu/hooks/useDeleteDailyMenu";

import { useDailyMenus } from "../features/dailyMenu/hooks/useDailyMenus";
import { useToggleDailyMenu } from "../features/dailyMenu/hooks/useToggleDailyMenu";

function DailyMenu() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingDailyMenu, setEditingDailyMenu] = useState(null);
  const [dailyMenuToToggle, setDailyMenuToToggle] = useState(null);
  const [deletingDailyMenu, setDeletingDailyMenu] = useState(null);

  const { dailyMenus, isLoading, error } = useDailyMenus();

  const { toggleDailyMenu, isToggling } = useToggleDailyMenu();

  const { deleteDailyMenu, isDeleting } = useDeleteDailyMenu();

  function handleToggleActive(dailyMenu) {
    setDailyMenuToToggle(dailyMenu);
  }

  function handleDeleteDailyMenu(dailyMenu) {
    setDeletingDailyMenu(dailyMenu);
  }

  function handleConfirmToggle() {
    if (!dailyMenuToToggle) return;

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

  if (isLoading) {
    return <p>Loading daily menus...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error.message}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Daily Menu</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your daily menu offers.
          </p>
        </div>

        <Button onClick={() => setIsCreating(true)}>Create daily menu</Button>
      </div>

      {/* Daily menus */}

      <DailyMenuList
        dailyMenus={dailyMenus}
        onEdit={(dailyMenu) => setEditingDailyMenu(dailyMenu)}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteDailyMenu}
      />

      {/* Create modal */}

      {isCreating && (
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

      {/* Edit modal */}

      {editingDailyMenu && (
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

      {/* Delete modal */}

      {deletingDailyMenu && (
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

      {/* Activate / deactivate confirmation */}

      {dailyMenuToToggle && (
        <DailyMenuStatusModal
          dailyMenu={dailyMenuToToggle}
          onClose={() => setDailyMenuToToggle(null)}
          onConfirm={handleConfirmToggle}
          isProcessing={isToggling}
        />
      )}
    </div>
  );
}

export default DailyMenu;
