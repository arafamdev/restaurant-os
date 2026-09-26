import { isSameDay } from "date-fns";

function useReservationFilters({
  reservations,
  search,
  statusFilter,
  selectedDate,
}) {
  const reservationsForSelectedDate = selectedDate
    ? reservations.filter((reservation) =>
        isSameDay(new Date(reservation.starts_at), selectedDate),
      )
    : reservations;

  const filteredReservations = reservationsForSelectedDate.filter(
    (reservation) => {
      const matchesSearch = reservation.customers.full_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    },
  );

  function getEmptyState() {
    if (reservations.length === 0) {
      return {
        title: "No reservations yet.",
        message: "There are currently no reservations to display.",
      };
    }

    if (selectedDate && reservationsForSelectedDate.length === 0) {
      return {
        title: "No reservations for this date.",
        message: "There are no reservations scheduled for the selected date.",
      };
    }

    if (
      selectedDate &&
      statusFilter !== "all" &&
      reservationsForSelectedDate.length > 0
    ) {
      return {
        title: "No reservations with this status.",
        message:
          "There are reservations on this date, but none match the selected status.",
      };
    }

    if (statusFilter !== "all") {
      return {
        title: "No reservations with this status.",
        message: "There are no reservations matching the selected status.",
      };
    }

    if (search) {
      return {
        title: "No reservations found.",
        message: "We couldn't find any reservation matching your search.",
      };
    }

    return {
      title: "No reservations found.",
      message: "No reservations match the current filters.",
    };
  }

  return {
    filteredReservations,
    emptyState: getEmptyState(),
  };
}

export default useReservationFilters;
