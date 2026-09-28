function MenuRow({ menuItem }) {
  const { name, description, price, is_active, is_available, menu_categories } =
    menuItem;

  const status = !is_active
    ? "Inactive"
    : !is_available
      ? "Unavailable"
      : "Available";

  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-700",
    Unavailable: "bg-yellow-50 text-yellow-700",
    Inactive: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex items-center justify-between gap-6 border-b border-gray-100 px-5 py-5 last:border-b-0">
      <div className="min-w-0">
        <h3 className="font-medium text-gray-900">{name}</h3>

        <p className="mt-1 text-xs font-medium text-gray-400">
          {menu_categories?.name}
        </p>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-5 text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-base font-semibold text-gray-900">
          €{Number(price).toFixed(2)}
        </p>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default MenuRow;
