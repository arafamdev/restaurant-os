function RestaurantTableIcon({ shape = "round", status = "available" }) {
  const tableColors = {
    available: "bg-emerald-500 dark:bg-emerald-900",
    selected: "bg-emerald-600 dark:bg-emerald-800",
    occupied: "bg-red-500 dark:bg-red-900",
    maintenance: "bg-gray-400 dark:bg-gray-600",
  };

  const chairColors = {
    available: "bg-gray-400 dark:bg-gray-600",
    selected: "bg-emerald-300 dark:bg-emerald-800",
    occupied: "bg-red-300 dark:bg-red-900",
    maintenance: "bg-gray-300 dark:bg-gray-700",
  };

  const tableColor = tableColors[status] ?? tableColors.available;
  const chairColor = chairColors[status] ?? chairColors.available;

  return (
    <div className="relative h-12 w-12 shrink-0">
      {/* Mesa */}
      <div
        className={`absolute inset-2 ${tableColor} ${
          shape === "round" ? "rounded-full" : "rounded-md"
        }`}
      />

      {/* Cadeiras */}
      <div
        className={`absolute top-0 left-1/2 h-2.5 w-3 -translate-x-1/2 rounded-sm ${chairColor}`}
      />

      <div
        className={`absolute bottom-0 left-1/2 h-2.5 w-3 -translate-x-1/2 rounded-sm ${chairColor}`}
      />

      <div
        className={`absolute top-1/2 left-0 h-3 w-2 -translate-y-1/2 rounded-sm ${chairColor}`}
      />

      <div
        className={`absolute top-1/2 right-0 h-3 w-2 -translate-y-1/2 rounded-sm ${chairColor}`}
      />
    </div>
  );
}

export default RestaurantTableIcon;
