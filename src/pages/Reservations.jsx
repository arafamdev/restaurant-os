import { useCallback, useState } from "react";

import {
  HiOutlinePlus,
  HiOutlineXMark,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import { useReservations } from "../features/reservations/hooks/useReservations";
import useReservationFilters from "../features/reservations/hooks/useReservationFilters";

import ReservationList from "../features/reservations/components/ReservationList";
import ReservationFilters from "../features/reservations/components/ReservationFilters";
import ReservationStats from "../features/reservations/components/ReservationStats";
import ReservationForm from "../features/reservations/components/ReservationForm";

import { getReservationStats } from "../features/reservations/utils/reservationUtils";

import useViewMode from "../hooks/useViewMode";

import PageHeader from "../ui/PageHeader";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import EmptyState from "../ui/EmptyState";
import ViewSwitcher from "../ui/ViewSwitcher";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

function Reservations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState();

  const [view, setView] = useViewMode("reservations");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { isLoading, reservations, error } = useReservations();

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

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
    <>
      <div className="min-h-full space-y-6 bg-gray-50/70 p-4 sm:p-6 dark:bg-[#0B1120]">
        {/* Page header */}
        <PageHeader
          icon={HiOutlineCalendarDays}
          title="Reservations"
          description="Manage restaurant reservations and guest bookings."
          action={
            <Button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:ring-4 focus:ring-emerald-500/25 focus:outline-none sm:w-auto"
            >
              <HiOutlinePlus className="h-5 w-5" />
              New Reservation
            </Button>
          }
        />
        {/* Reservation statistics */}
        <ReservationStats
          totalReservations={totalReservations}
          reservationsByStatus={reservationsByStatus}
        />
        {/* Filters */}
        <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md sm:p-5 dark:border-gray-800 dark:bg-[#111827] dark:hover:border-emerald-500/30">
          <ReservationFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </section>
        {/* Results header */}
        <section className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                All reservations
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filteredReservations.length}
                {filteredReservations.length === 1
                  ? "reservation"
                  : "reservations"}
                shown
              </p>
            </div>

            <div className="transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none">
              <ViewSwitcher value={view} onChange={setView} />
            </div>
          </div>

          {/* Reservations list */}
          {filteredReservations.length > 0 ? (
            <ReservationList reservations={filteredReservations} view={view} />
          ) : (
            <EmptyState {...emptyState} />
          )}
        </section>
      </div>
      {/* Create reservation modal */}
      {isCreateModalOpen && (
        <Modal
          size="large"
          onClose={closeCreateModal}
          closeOnOverlayClick={true}
          closeOnEscape={true}
        >
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-700">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <HiOutlinePlus size={18} />
                New booking
              </div>

              <h2
                id="create-reservation-title"
                className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100"
              >
                New reservation
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                Enter the guest details and choose a suitable table and time.
              </p>
            </div>

            <button
              type="button"
              onClick={closeCreateModal}
              aria-label="Close new reservation form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 motion-reduce:transform-none motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <HiOutlineXMark size={23} />
            </button>
          </div>

          <ReservationForm />
        </Modal>
      )}
    </>
  );
}

export default Reservations;
