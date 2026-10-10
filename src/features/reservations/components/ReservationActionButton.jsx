function ReservationActionButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-gray-950 dark:hover:bg-emerald-400",

    blue: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400",

    dark: "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",

    danger:
      "border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20",

    warning:
      "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] ?? variants.primary}`}
    >
      {children}
    </button>
  );
}

export default ReservationActionButton;
