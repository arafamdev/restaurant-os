import {
  RESERVATION_STATUS,
  RESERVATION_STATUS_LABELS,
} from "../../../constants";

function ReservationStats({ totalReservations, reservationsByStatus }) {
  const statusOrder = [
    RESERVATION_STATUS.PENDING,
    RESERVATION_STATUS.CONFIRMED,
    RESERVATION_STATUS.SEATED,
    RESERVATION_STATUS.COMPLETED,
    RESERVATION_STATUS.CANCELLED,
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
        {/* Total */}
        <div className="flex flex-col items-center justify-center px-4 py-4">
          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
            Total
          </span>

          <span className="mt-1 text-2xl font-semibold text-gray-900">
            {totalReservations}
          </span>
        </div>

        {/* Statuses */}
        {statusOrder.map((status) => (
          <div
            key={status}
            className="flex flex-col items-center justify-center px-4 py-4"
          >
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              {RESERVATION_STATUS_LABELS[status]}
            </span>

            <span className="mt-1 text-2xl font-semibold text-gray-900">
              {reservationsByStatus[status] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReservationStats;
