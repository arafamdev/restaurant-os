import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useReservations } from "../features/reservations/hooks/useReservations";
import useReservationFilters from "../features/reservations/hooks/useReservationFilters";

import ReservationList from "../features/reservations/components/ReservationList";
import ReservationFilters from "../features/reservations/components/ReservationFilters";
import ReservationStats from "../features/reservations/components/ReservationStats";

import { getReservationStats } from "../features/reservations/utils/reservationUtils";

import useViewMode from "../hooks/useViewMode";

import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import EmptyState from "../ui/EmptyState";
import ViewSwitcher from "../ui/ViewSwitcher";

function Reservations() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState();

  const [view, setView] = useViewMode("reservations");

  const { isLoading, reservations, error } = useReservations();

  const { filteredReservations, emptyState } = useReservationFilters({
    reservations: reservations ?? [],
    search,
    statusFilter,
    selectedDate,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message="Could not load reservations." />;
  }

  const { totalReservations, reservationsByStatus } = getReservationStats(
    reservations ?? [],
  );

  return (
    <div className="space-y-6 p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
          onClick={() => navigate("/reservations/new")}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + New reservation
        </button>
      </div>

      {/* STATS */}
      <ReservationStats
        totalReservations={totalReservations}
        reservationsByStatus={reservationsByStatus}
      />

      {/* FILTERS */}
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

      {/* RESULTS HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reservations</h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredReservations.length}{" "}
            {filteredReservations.length === 1 ? "reservation" : "reservations"}{" "}
            shown
          </p>
        </div>

        <ViewSwitcher value={view} onChange={setView} />
      </div>

      {/* RESERVATIONS */}
      {filteredReservations.length > 0 ? (
        <ReservationList reservations={filteredReservations} view={view} />
      ) : (
        <EmptyState {...emptyState} />
      )}
    </div>
  );
}

export default Reservations;
