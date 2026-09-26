export const RESERVATION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SEATED: "seated",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const RESERVATION_STATUS_STYLES = {
  [RESERVATION_STATUS.PENDING]: "bg-yellow-100 text-yellow-700",
  [RESERVATION_STATUS.CONFIRMED]: "bg-green-100 text-green-700",
  [RESERVATION_STATUS.SEATED]: "bg-blue-100 text-blue-700",
  [RESERVATION_STATUS.COMPLETED]: "bg-gray-100 text-gray-700",
  [RESERVATION_STATUS.CANCELLED]: "bg-red-100 text-red-700",
};
