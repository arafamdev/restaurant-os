import ReservationList from "../features/reservations/components/ReservationList";
import { useReservations } from "../features/reservations/hooks/useReservations";

import ErrorMessage from "../ui/ErrorMessage";
import Spinner from "../ui/Spinner";

function Reservations() {
  const { isLoading, reservations, error } = useReservations();

  if (isLoading) return <Spinner />;

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Reservations</h1>

      <div className="mt-6 space-y-4">
        <ReservationList reservations={reservations} />
      </div>
    </div>
  );
}

export default Reservations;
