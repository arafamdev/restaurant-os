import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";

function DailyMenuStatusModal({ dailyMenu, onClose, onConfirm, isProcessing }) {
  if (!dailyMenu) return null;

  const isDeactivating = dailyMenu.is_active;

  return (
    <Modal onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {isDeactivating ? "Deactivate daily menu?" : "Activate daily menu?"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {isDeactivating
            ? `Are you sure you want to deactivate "${dailyMenu.name}"? It will no longer be available as an active daily menu.`
            : `Are you sure you want to activate "${dailyMenu.name}"?`}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variation="secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variation={isDeactivating ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : isDeactivating
                ? "Deactivate"
                : "Activate"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DailyMenuStatusModal;
