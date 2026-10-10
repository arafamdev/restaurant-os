import { useEffect } from "react";

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isLoading, onClose]);

  if (!open) return null;

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !isLoading) {
      onClose();
    }
  }

  function handleConfirm() {
    if (isLoading) return;
    onConfirm();
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-[#111827]"
      >
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100"
        >
          {title}
        </h2>

        <p
          id="confirm-modal-description"
          className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400"
        >
          {description}
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmModal;
