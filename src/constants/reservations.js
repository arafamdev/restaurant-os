export const RESERVATION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SEATED: "seated",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

export const RESERVATION_STATUS_STYLES = {
  [RESERVATION_STATUS.PENDING]: "bg-yellow-100 text-yellow-700",
  [RESERVATION_STATUS.CONFIRMED]: "bg-green-100 text-green-700",
  [RESERVATION_STATUS.SEATED]: "bg-blue-100 text-blue-700",
  [RESERVATION_STATUS.COMPLETED]: "bg-gray-100 text-gray-700",
  [RESERVATION_STATUS.CANCELLED]: "bg-red-100 text-red-700",
  [RESERVATION_STATUS.NO_SHOW]: "bg-orange-100 text-orange-700",
};

export const RESERVATION_STATUS_LABELS = {
  [RESERVATION_STATUS.PENDING]: "Pending",
  [RESERVATION_STATUS.CONFIRMED]: "Confirmed",
  [RESERVATION_STATUS.SEATED]: "Seated",
  [RESERVATION_STATUS.COMPLETED]: "Completed",
  [RESERVATION_STATUS.CANCELLED]: "Cancelled",
  [RESERVATION_STATUS.NO_SHOW]: "No-show",
};

export const RESERVATION_TIME_OPTIONS = [
  { value: "12:00", label: "12:00" },
  { value: "12:30", label: "12:30" },
  { value: "13:00", label: "13:00" },
  { value: "13:30", label: "13:30" },
  { value: "14:00", label: "14:00" },
  { value: "14:30", label: "14:30" },
  { value: "15:00", label: "15:00" },
  { value: "15:30", label: "15:30" },
  { value: "16:00", label: "16:00" },
  { value: "16:30", label: "16:30" },
  { value: "17:00", label: "17:00" },
  { value: "17:30", label: "17:30" },
  { value: "18:00", label: "18:00" },
  { value: "18:30", label: "18:30" },
  { value: "19:00", label: "19:00" },
  { value: "19:30", label: "19:30" },
  { value: "20:00", label: "20:00" },
  { value: "20:30", label: "20:30" },
  { value: "21:00", label: "21:00" },
];

export const LAST_RESERVATION_TIME = "21:00";
