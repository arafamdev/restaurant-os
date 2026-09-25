function Button({
  children,
  variation = "primary",
  size = "medium",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer";

  const variations = {
    primary:
      "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500",

    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400",

    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  const sizes = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-4 py-2.5 text-sm",
    large: "px-5 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variations[variation]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
