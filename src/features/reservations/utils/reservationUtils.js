import { RESERVATION_STATUS } from "../../../constants";

export function getReservationStats(reservations) {
  const totalReservations = reservations.length;

  const reservationsByStatus = Object.values(RESERVATION_STATUS).reduce(
    (stats, status) => {
      stats[status] = reservations.filter(
        (reservation) => reservation.status === status,
      ).length;

      return stats;
    },
    {},
  );

  return {
    totalReservations,
    reservationsByStatus,
  };
}
