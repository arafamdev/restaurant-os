import ReservationForm from "../features/reservations/components/ReservationForm";

function NewReservation() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          New reservation
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new reservation for a restaurant guest.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ReservationForm />
      </div>
    </div>
  );
}

export default NewReservation;
