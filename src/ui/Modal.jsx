import { useEffect } from "react";

function Modal({
  children,
  onClose,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) {
  useEffect(() => {
    if (!closeOnEscape) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, closeOnEscape]);

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    xlarge: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 text-gray-950 shadow-xl transition-colors dark:border-[#374151] dark:bg-[#111827] dark:text-[#F9FAFB] ${
          sizeClasses[size] ?? sizeClasses.medium
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
