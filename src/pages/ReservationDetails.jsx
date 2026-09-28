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
      <div className="p-6">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-6">
        <ErrorMessage message="Reservation not found." />
      </div>
    );
  }

  const { customers, tables, guests, status, starts_at, ends_at, notes } =
    reservation;

  const reservationDate = formatReservationDate(starts_at, ends_at);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          to="/reservations"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <BackButton to="/tables" label="Back to Tables" />
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Reservation #{reservation.id}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
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
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Customer</h2>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {customers.full_name}
              </p>
            </div>

            {customers.email && (
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Email
                </p>

                <p className="mt-1 text-sm text-gray-700">{customers.email}</p>
              </div>
            )}

            {customers.phone && (
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Phone
                </p>

                <p className="mt-1 text-sm text-gray-700">{customers.phone}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Reservation</h2>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Date & time
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {reservationDate}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Guests
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {guests} {guests === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Table</h2>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Table
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Table {tables.table_number}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Capacity
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {tables.capacity} seats
              </p>
            </div>

            {tables.location && (
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Location
                </p>

                <p className="mt-1 text-sm text-gray-700">{tables.location}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Notes</h2>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            {notes || "No notes for this reservation."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetails;
