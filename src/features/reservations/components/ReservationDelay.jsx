import { RESERVATION_GRACE_PERIOD_MINUTES } from "../utils/reservationUtils";

import useReservationDelay from "../hooks/useReservationDelay";

function ReservationDelay({ startsAt, status }) {
  const delay = useReservationDelay(startsAt);
  const isActive = status === "confirmed";

  if (!isActive || delay <= 0) {
    return null;
  }

  if (delay >= RESERVATION_GRACE_PERIOD_MINUTES) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
        <p className="font-semibold text-red-700 dark:text-red-400">
          Reservation expired
        </p>

        <p className="mt-1 text-sm text-red-600 dark:text-red-300">
          The guest has not arrived within the 15-minute grace period.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
      <p className="font-semibold text-yellow-700 dark:text-amber-400">
        Guest is late — {delay} {delay === 1 ? "min" : "mins"}
      </p>

      <p className="mt-1 text-sm text-yellow-600 dark:text-amber-300">
        The reservation started {delay} {delay === 1 ? "minute" : "minutes"}{" "}
        ago.
      </p>
    </div>
  );
}

export default ReservationDelay;
