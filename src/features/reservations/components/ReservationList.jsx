import ReservationCard from "./ReservationCard";

function ReservationList({ reservations, view = "compact" }) {
  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Guest
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Table
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Date & time
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Guests
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Status
                </th>

                <th className="w-16 px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  view="list"
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const gridClass =
    view === "large"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

  return (
    <div className={gridClass}>
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          view={view}
        />
      ))}
    </div>
  );
}

export default ReservationList;
