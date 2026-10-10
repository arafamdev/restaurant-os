import { useNavigate } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineCalendarDays,
  HiOutlineUsers,
} from "react-icons/hi2";

import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "../../../constants";

import { formatReservationDate } from "../../../utils/dateUtils";

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function ReservationCard({ reservation, view = "compact" }) {
  const navigate = useNavigate();

  const { customers, tables, guests, status, starts_at, ends_at, notes } =
    reservation;

  const reservationDate = formatReservationDate(starts_at, ends_at);
  const initials = getInitials(customers?.full_name);

  const statusBadge = (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
        RESERVATION_STATUS_STYLES[status]
      }`}
    >
      {RESERVATION_STATUS_LABELS[status]}
    </span>
  );

  function handleClick() {
    navigate(`/reservations/${reservation.id}`);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/reservations/${reservation.id}`);
    }
  }

  const avatar = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-100">
      {initials}
    </div>
  );

  // LIST VIEW
  if (view === "list") {
    return (
      <tr
        tabIndex={0}
        role="link"
        aria-label={`Open reservation for ${customers?.full_name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group cursor-pointer transition-colors outline-none hover:bg-gray-50/80 focus-visible:bg-gray-50/80 dark:hover:bg-gray-800/60 dark:focus-visible:bg-gray-800/60"
      >
        {/* GUEST */}
        <td className="px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {avatar}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {customers?.full_name}
              </p>

              {notes && (
                <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
                  {notes}
                </p>
              )}
            </div>
          </div>
        </td>

        {/* TABLE */}
        <td className="px-5 py-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>Table {tables?.table_number}</p>

            {tables?.location && (
              <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
                {tables.location}
              </p>
            )}
          </div>
        </td>

        {/* DATE */}
        <td className="px-5 py-4">
          <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{reservationDate}</span>
          </div>
        </td>

        {/* GUESTS */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <HiOutlineUsers className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <span>{guests}</span>
          </div>
        </td>

        {/* STATUS */}
        <td className="px-5 py-4 text-center">{statusBadge}</td>

        {/* ACTION */}
        <td className="px-5 py-4 text-right">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 group-hover:bg-gray-950 group-hover:text-white group-focus-visible:bg-gray-950 group-focus-visible:text-white dark:text-gray-500 dark:group-hover:bg-emerald-500 dark:group-hover:text-gray-950 dark:group-focus-visible:bg-emerald-500 dark:group-focus-visible:text-gray-950">
            <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </td>
      </tr>
    );
  }

  // COMPACT VIEW
  if (view === "compact") {
    return (
      <article
        tabIndex={0}
        role="link"
        aria-label={`Open reservation for ${customers?.full_name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="card-hover p-4"
      >
        <div className="flex items-start gap-3">
          {avatar}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-950 dark:text-gray-100">
                  {customers?.full_name}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">
                  Table {tables?.table_number}
                  {tables?.location && ` · ${tables.location}`}
                </p>
              </div>

              {statusBadge}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{reservationDate}</span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <HiOutlineUsers className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span>
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
            </div>

            {notes && (
              <p className="mt-2 truncate text-xs text-gray-400 dark:text-gray-500">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Note:
                </span>{" "}
                {notes}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  }

  // LARGE VIEW
  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={`Open reservation for ${customers?.full_name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-950/10 dark:border-gray-700 dark:bg-[#1F2937] dark:hover:border-gray-600 dark:hover:shadow-black/20 dark:focus-visible:border-emerald-500 dark:focus-visible:ring-emerald-500/20"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        {statusBadge}

        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 group-hover:bg-gray-950 group-hover:text-white dark:text-gray-500 dark:group-hover:bg-emerald-500 dark:group-hover:text-gray-950">
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* AVATAR */}
      <div className="mt-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-950 text-lg font-semibold tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:scale-105 dark:bg-emerald-500 dark:text-gray-950">
          {initials}
        </div>
      </div>

      {/* GUEST */}
      <div className="mt-5 text-center">
        <h3 className="truncate text-base font-semibold tracking-tight text-gray-950 dark:text-gray-100">
          {customers?.full_name}
        </h3>

        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Table {tables?.table_number}
          {tables?.location && ` · ${tables.location}`}
        </p>
      </div>

      {/* DETAILS */}
      <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
          <span className="truncate">{reservationDate}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <HiOutlineUsers className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span>
            {guests} {guests === 1 ? "guest" : "guests"}
          </span>
        </div>
      </div>

      {/* NOTES */}
      {notes && (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Note:
            </span>{" "}
            {notes}
          </p>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          View reservation
        </span>

        <HiOutlineArrowRight className="h-4 w-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-emerald-400" />
      </div>
    </article>
  );
}

export default ReservationCard;
