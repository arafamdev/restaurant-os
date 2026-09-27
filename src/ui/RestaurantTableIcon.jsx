function RestaurantTableIcon({ shape = "round", status = "available" }) {
  const tableColor = {
    available: "bg-emerald-500",
    selected: "bg-emerald-600",
    occupied: "bg-red-500",
    maintenance: "bg-gray-400",
  }[status];

  const chairColor = {
    available: "bg-gray-400",
    selected: "bg-emerald-300",
    occupied: "bg-red-300",
    maintenance: "bg-gray-300",
  }[status];

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
