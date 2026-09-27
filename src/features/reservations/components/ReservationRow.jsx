import { HiOutlineCalendarDays, HiOutlineUsers } from "react-icons/hi2";

import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "../../../constants";

import { formatReservationDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

function ReservationRow({ reservation }) {
  const navigate = useNavigate();
  const { customers, tables, guests, status, starts_at, ends_at, notes } =
    reservation;

  const reservationDate = formatReservationDate(starts_at, ends_at);

  const initials = customers.full_name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleClick() {
    navigate(`/reservations/${reservation.id}`);
  }

  const statusBadge = (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
        RESERVATION_STATUS_STYLES[status]
      }`}
    >
      {RESERVATION_STATUS_LABELS[status]}
    </span>
  );

  const avatar = (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
      {initials}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div
        onClick={handleClick}
        className="hidden cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 xl:grid xl:grid-cols-[minmax(180px,1.4fr)_110px_minmax(180px,1.3fr)_80px_120px]"
      >
        <div className="flex min-w-0 items-center gap-3">
          {avatar}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {customers.full_name}
            </p>

            {notes && (
              <p className="mt-0.5 truncate text-xs text-gray-400">{notes}</p>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-700">
          <p>Table {tables.table_number}</p>

          {tables.location && (
            <p className="mt-0.5 truncate text-xs text-gray-400">
              {tables.location}
            </p>
          )}
        </div>

        <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
          <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-gray-400" />

          <span className="truncate">{reservationDate}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlineUsers className="h-4 w-4 shrink-0 text-gray-400" />

          <span>{guests}</span>
        </div>

        <div className="flex justify-center">{statusBadge}</div>
      </div>

      {/* Tablet */}
      <div
        onClick={handleClick}
        className="hidden cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 md:grid md:grid-cols-[minmax(160px,1.5fr)_minmax(170px,1.3fr)_110px] xl:hidden"
      >
        <div className="flex min-w-0 items-center gap-3">
          {avatar}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {customers.full_name}
            </p>

            <p className="truncate text-xs text-gray-500">
              Table {tables.table_number}
              {tables.location && ` · ${tables.location}`}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
          <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-gray-400" />

          <span className="truncate">{reservationDate}</span>
        </div>

        <div className="flex justify-center">{statusBadge}</div>
      </div>

      {/* Mobile */}
      <div onClick={handleClick} className="space-y-3 px-4 py-4 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {avatar}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {customers.full_name}
              </p>

              <p className="text-xs text-gray-500">
                Table {tables.table_number}
              </p>
            </div>
          </div>

          {statusBadge}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <HiOutlineCalendarDays className="h-4 w-4 text-gray-400" />

            <span>{reservationDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <HiOutlineUsers className="h-4 w-4 text-gray-400" />

            <span>
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>
        </div>

        {notes && (
          <p className="truncate text-xs text-gray-400">
            <span className="font-medium text-gray-600">Note:</span> {notes}
          </p>
        )}
      </div>
    </>
  );
}

export default ReservationRow;
