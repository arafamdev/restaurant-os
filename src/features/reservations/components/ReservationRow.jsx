import { HiOutlineCalendarDays, HiOutlineUsers } from "react-icons/hi2";

import { RESERVATION_STATUS_STYLES } from "../../../constants";
import { formatReservationDate } from "../../../utils/dateUtils";

function ReservationRow({ reservation }) {
  const { customers, tables, guests, status, starts_at, ends_at, notes } =
    reservation;

  const reservationDate = formatReservationDate(starts_at, ends_at);

  const initials = customers.full_name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {customers.full_name}
            </p>

            <p className="text-sm text-gray-500">Table {tables.table_number}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <HiOutlineCalendarDays className="h-4 w-4" />

            <span>{reservationDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <HiOutlineUsers className="h-4 w-4" />

            <span>
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>
        </div>

        {notes && (
          <p className="mt-3 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Note:</span> {notes}
          </p>
        )}
      </div>

      {/* Status */}
      {/* <span
        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          status === RESERVATION_STATUS.CONFIRMED
            ? "bg-green-100 text-green-700"
            : status === RESERVATION_STATUS.PENDING
              ? "bg-yellow-100 text-yellow-700"
              : status === RESERVATION_STATUS.SEATED
                ? "bg-blue-100 text-blue-700"
                : status === RESERVATION_STATUS.COMPLETED
                  ? "bg-gray-100 text-gray-700"
                  : "bg-red-100 text-red-700"
        }`}
      >
        {status}
      </span> */}

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          RESERVATION_STATUS_STYLES[status]
        }`}
      >
        {status}
      </span>
    </div>
  );
}

export default ReservationRow;
