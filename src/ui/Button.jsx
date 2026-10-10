function Button({
  children,
  variation = "primary",
  size = "medium",
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer motion-reduce:transition-none dark:focus:ring-offset-[#0B1120]";

  const variations = {
    primary:
      "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500",

    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400 dark:border-[#374151] dark:bg-[#1F2937] dark:text-[#F9FAFB] dark:hover:bg-[#374151] dark:focus:ring-gray-500",

    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600",
  };

  const sizes = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-4 py-2.5 text-sm",
    large: "px-5 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variations[variation] ?? variations.primary} ${sizes[size] ?? sizes.medium} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
