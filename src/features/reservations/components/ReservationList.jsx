import ReservationRow from "./ReservationRow";

function ReservationList({ reservations }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop header */}
      <div className="hidden grid-cols-[minmax(180px,1.4fr)_110px_minmax(180px,1.3fr)_80px_120px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase xl:grid">
        <span>Guest</span>
        <span>Table</span>
        <span>Date & time</span>
        <span>Guests</span>
        <span className="text-center">Status</span>
      </div>

      {/* Tablet header */}
      <div className="hidden grid-cols-[minmax(160px,1.5fr)_minmax(170px,1.3fr)_110px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase md:grid xl:hidden">
        <span>Guest</span>
        <span>Date & time</span>
        <span className="text-center">Status</span>
      </div>

      <div className="divide-y divide-gray-100">
        {reservations.map((reservation) => (
          <ReservationRow key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}

export default ReservationList;
