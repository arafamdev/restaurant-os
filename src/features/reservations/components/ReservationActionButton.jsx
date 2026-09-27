function ReservationActionButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    blue: "bg-blue-600 text-white hover:bg-blue-700",
    dark: "bg-gray-900 text-white hover:bg-gray-800",
    danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
    warning:
      "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default ReservationActionButton;
