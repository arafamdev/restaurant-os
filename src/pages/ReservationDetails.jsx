import { useParams, Link } from "react-router-dom";

import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import ReservationActions from "../features/reservations/components/ReservationActions";
import ReservationDelay from "../features/reservations/components/ReservationDelay";
import { useReservation } from "../features/reservations/hooks/useReservation";

import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
} from "../constants";

import { formatReservationDate } from "../utils/dateUtils";
import BackButton from "../ui/BackButton";

function ReservationDetails() {
  const { reservationId } = useParams();

  const { reservation, isLoading, error } = useReservation(reservationId);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorMessage message="Reservation not found." />
      </div>
    );
  }

  const { customers, tables, guests, status, starts_at, ends_at, notes } =
    reservation;

  const reservationDate = formatReservationDate(starts_at, ends_at);

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700/80 dark:bg-[#111827]";

  const labelClass =
    "text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500";

  const valueClass =
    "mt-1 text-sm font-medium break-words text-gray-900 dark:text-gray-100";

  const secondaryValueClass =
    "mt-1 text-sm leading-6 break-words text-gray-600 dark:text-gray-300";

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <Link
          to="/reservations"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <BackButton to="/reservations" label="Back to Reservations" />
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
              Reservation #{reservation.id}
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Reservation details and information.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
              RESERVATION_STATUS_STYLES[status]
            }`}
          >
            {RESERVATION_STATUS_LABELS[status]}
          </span>
        </div>
      </div>

      {/* Late / expired information */}
      <ReservationDelay startsAt={starts_at} status={status} />

      {/* Actions */}
      <ReservationActions reservation={reservation} />

      {/* Reservation information */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Customer */}
        <section className={cardClass}>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Customer
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className={labelClass}>Name</p>
              <p className={valueClass}>
                {customers?.full_name || "Not available"}
              </p>
            </div>

            {customers?.email && (
              <div>
                <p className={labelClass}>Email</p>
                <p className={secondaryValueClass}>{customers.email}</p>
              </div>
            )}

            {customers?.phone && (
              <div>
                <p className={labelClass}>Phone</p>
                <p className={secondaryValueClass}>{customers.phone}</p>
              </div>
            )}
          </div>
        </section>

        {/* Reservation */}
        <section className={cardClass}>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Reservation
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className={labelClass}>Date & time</p>
              <p className={valueClass}>{reservationDate}</p>
            </div>

            <div>
              <p className={labelClass}>Guests</p>
              <p className={secondaryValueClass}>
                {guests} {guests === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className={cardClass}>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Table
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className={labelClass}>Table</p>
              <p className={valueClass}>
                {tables?.table_number != null
                  ? `Table ${tables.table_number}`
                  : "Not assigned"}
              </p>
            </div>

            <div>
              <p className={labelClass}>Capacity</p>
              <p className={secondaryValueClass}>
                {tables?.capacity != null
                  ? `${tables.capacity} seats`
                  : "Not available"}
              </p>
            </div>

            {tables?.location && (
              <div>
                <p className={labelClass}>Location</p>
                <p className={secondaryValueClass}>{tables.location}</p>
              </div>
            )}
          </div>
        </section>

        {/* Notes */}
        <section className={cardClass}>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Notes
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {notes || "No notes for this reservation."}
          </p>
        </section>
      </div>
    </div>
  );
}

export default ReservationDetails;
