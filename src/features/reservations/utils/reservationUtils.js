import { RESERVATION_STATUS } from "../../../constants";

export const RESERVATION_GRACE_PERIOD_MINUTES = 15;

export function getReservationDelay(startsAt) {
  const start = new Date(startsAt);
  const now = new Date();

  const differenceInMilliseconds = now.getTime() - start.getTime();

  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60),
  );

  if (differenceInMinutes <= 0) return 0;

  return differenceInMinutes;
}

export function isReservationExpired(startsAt) {
  return getReservationDelay(startsAt) >= RESERVATION_GRACE_PERIOD_MINUTES;
}

export function canMarkReservationAsNoShow(status, delay) {
  return (
    status === RESERVATION_STATUS.CONFIRMED &&
    delay >= RESERVATION_GRACE_PERIOD_MINUTES
  );
}

export function getReservationStats(reservations) {
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
    totalReservations: reservations.length,
    reservationsByStatus,
  };
}
