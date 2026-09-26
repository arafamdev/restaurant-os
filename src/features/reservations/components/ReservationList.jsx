import ReservationRow from "./ReservationRow";

function ReservationList({ reservations }) {
  return (
    <div className="mt-6 space-y-4">
      {reservations.map((reservation) => (
        <ReservationRow key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
}

export default ReservationList;
