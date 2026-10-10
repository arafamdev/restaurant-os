import Modal from "../../../ui/Modal";

function ReservationActionModal({ action, isUpdating, onClose, onConfirm }) {
  if (!action) return null;

  return (
    <Modal onClose={onClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {action.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {action.message}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={isUpdating}
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${action.confirmClass}`}
          >
            {isUpdating ? "Updating..." : action.confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ReservationActionModal;
