import { RESERVATION_STATUS } from "../../../constants";

export const RESERVATION_ACTION_CONFIG = {
  [RESERVATION_STATUS.CONFIRMED]: {
    title: "Confirm reservation?",
    message: "This reservation will be marked as confirmed.",
    confirmLabel: "Confirm reservation",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700",
  },

  [RESERVATION_STATUS.SEATED]: {
    title: "Mark as seated?",
    message: "This will mark the guest as seated.",
    confirmLabel: "Mark as seated",
    confirmClass: "bg-blue-600 hover:bg-blue-700",
  },

  [RESERVATION_STATUS.COMPLETED]: {
    title: "Complete reservation?",
    message: "This will mark the reservation as completed.",
    confirmLabel: "Complete reservation",
    confirmClass: "bg-gray-900 hover:bg-gray-800",
  },

  [RESERVATION_STATUS.CANCELLED]: {
    title: "Cancel reservation?",
    message: "Are you sure you want to cancel this reservation?",
    confirmLabel: "Cancel reservation",
    confirmClass: "bg-red-600 hover:bg-red-700",
  },

  [RESERVATION_STATUS.NO_SHOW]: {
    title: "Mark as no-show?",
    message: "This will mark the guest as a no-show and release the table.",
    confirmLabel: "Mark as no-show",
    confirmClass: "bg-orange-600 hover:bg-orange-700",
  },
};
