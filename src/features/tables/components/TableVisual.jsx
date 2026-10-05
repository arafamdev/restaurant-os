import { HiOutlineUser } from "react-icons/hi2";

function TableVisual({
  tableNumber,
  capacity,
  status = "available",
  size = "compact",
}) {
  const statusStyles = {
    available: {
      table: "border-emerald-200 bg-emerald-50",
      number: "text-emerald-700",
      chair: "bg-emerald-100 text-emerald-600",
    },
    occupied: {
      table: "border-blue-200 bg-blue-50",
      number: "text-blue-700",
      chair: "bg-blue-100 text-blue-600",
    },
    maintenance: {
      table: "border-amber-200 bg-amber-50",
      number: "text-amber-700",
      chair: "bg-amber-100 text-amber-600",
    },
  };

  const currentStyles = statusStyles[status] || statusStyles.available;

  const sizeStyles = {
    compact: {
      container: "h-24 w-28",
      table: "h-14 w-16 rounded-xl",
      number: "text-sm",
      chair: "h-5 w-5",
      icon: "h-2.5 w-2.5",
    },
    large: {
      container: "h-40 w-48",
      table: "h-24 w-28 rounded-2xl",
      number: "text-xl",
      chair: "h-7 w-7",
      icon: "h-3.5 w-3.5",
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.compact;

  const chairPositions = {
    1: ["left-1/2 top-0 -translate-x-1/2"],

    2: ["left-0 top-1/2 -translate-y-1/2", "right-0 top-1/2 -translate-y-1/2"],

    3: [
      "left-1/2 top-0 -translate-x-1/2",
      "bottom-0 left-1/4",
      "bottom-0 right-1/4",
    ],

    4: [
      "left-1/2 top-0 -translate-x-1/2",
      "bottom-0 left-1/2 -translate-x-1/2",
      "left-0 top-1/2 -translate-y-1/2",
      "right-0 top-1/2 -translate-y-1/2",
    ],

    5: [
      "left-1/2 top-0 -translate-x-1/2",
      "bottom-0 left-1/4",
      "bottom-0 right-1/4",
      "left-0 top-1/2 -translate-y-1/2",
      "right-0 top-1/2 -translate-y-1/2",
    ],

    6: [
      "left-1/4 top-0",
      "right-1/4 top-0",
      "bottom-0 left-1/4",
      "bottom-0 right-1/4",
      "left-0 top-1/2 -translate-y-1/2",
      "right-0 top-1/2 -translate-y-1/2",
    ],

    7: [
      "left-1/4 top-0",
      "left-1/2 top-0 -translate-x-1/2",
      "right-1/4 top-0",
      "bottom-0 left-1/4",
      "bottom-0 right-1/4",
      "left-0 top-1/2 -translate-y-1/2",
      "right-0 top-1/2 -translate-y-1/2",
    ],

    8: [
      "left-1/4 top-0",
      "left-1/2 top-0 -translate-x-1/2",
      "right-1/4 top-0",
      "bottom-0 left-1/4",
      "bottom-0 left-1/2 -translate-x-1/2",
      "bottom-0 right-1/4",
      "left-0 top-1/2 -translate-y-1/2",
      "right-0 top-1/2 -translate-y-1/2",
    ],
  };

  const normalizedCapacity = Math.max(1, Math.min(Number(capacity) || 4, 8));

  const positions = chairPositions[normalizedCapacity] || chairPositions[4];

  return (
    <div
      className={`relative ${currentSize.container}`}
      aria-label={`Table ${tableNumber} with capacity for ${capacity} guests`}
    >
      {positions.map((position, index) => (
        <span
          key={index}
          className={`absolute ${position} ${currentSize.chair} flex items-center justify-center rounded-full ${currentStyles.chair}`}
        >
          <HiOutlineUser className={currentSize.icon} aria-hidden="true" />
        </span>
      ))}

      <div
        className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border ${currentSize.table} ${currentStyles.table} shadow-sm`}
      >
        <span
          className={`font-semibold tracking-tight ${currentSize.number} ${currentStyles.number}`}
        >
          {String(tableNumber).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default TableVisual;
