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
    RESERVATION_STATUS.NO_SHOW,
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {" "}
      <StatCard
        label="Total"
        value={totalReservations}
        description="All reservations"
      />
      {statusOrder.map((status) => (
        <StatCard
          key={status}
          label={RESERVATION_STATUS_LABELS[status]}
          value={reservationsByStatus?.[status] ?? 0}
        />
      ))}
    </section>
  );
}

function StatCard({ label, value, description }) {
  return (
    <article className="group relative flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200/80 bg-white px-3 py-5 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-gray-200/50 motion-reduce:transform-none motion-reduce:transition-none sm:px-4 dark:border-gray-800 dark:bg-[#111827] dark:hover:border-emerald-500/40 dark:hover:shadow-black/20">
      {" "}
      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase transition-colors duration-300 group-hover:text-emerald-700 dark:text-gray-400 dark:group-hover:text-emerald-400">
        {label}{" "}
      </span>
      <span className="mt-1 text-2xl font-semibold text-gray-900 tabular-nums transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none dark:text-gray-100">
        {value}
      </span>
      {description && (
        <span className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
          {description}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-emerald-500 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
    </article>
  );
}

export default ReservationStats;
