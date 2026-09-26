import { useState } from "react";

import { useReservations } from "../features/reservations/hooks/useReservations";
import useReservationFilters from "../features/reservations/hooks/useReservationFilters";

import ReservationList from "../features/reservations/components/ReservationList";
import ReservationFilters from "../features/reservations/components/ReservationFilters";
import ReservationStats from "../features/reservations/components/ReservationStats";

import { getReservationStats } from "../features/reservations/utils/reservationUtils";

import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import EmptyState from "../ui/EmptyState";

function Reservations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState();

  const { isLoading, reservations, error } = useReservations();

  const { filteredReservations, emptyState } = useReservationFilters({
    reservations: reservations ?? [],
    search,
    statusFilter,
    selectedDate,
  });

  if (isLoading) return <Spinner />;

  if (error) {
    return <ErrorMessage message="Could not load reservations." />;
  }

  const { totalReservations, reservationsByStatus } =
    getReservationStats(reservations);

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Reservations
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage restaurant reservations and guest bookings.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + New reservation
        </button>
      </div>

      {/* Reservation statistics */}
      <ReservationStats
        totalReservations={totalReservations}
        reservationsByStatus={reservationsByStatus}
      />

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ReservationFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reservations</h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredReservations.length}{" "}
            {filteredReservations.length === 1 ? "reservation" : "reservations"}{" "}
            shown
          </p>
        </div>
      </div>

      {/* Reservations */}
      {filteredReservations.length > 0 ? (
        <ReservationList reservations={filteredReservations} />
      ) : (
        <EmptyState {...emptyState} />
      )}
    </div>
  );
}

export default Reservations;
