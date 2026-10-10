import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ReservationCustomerField from "./ReservationCustomerField";
import ReservationDateField from "./ReservationDateField";
import ReservationTimeField from "./ReservationTimeField";
import ReservationGuestsField from "./ReservationGuestsField";
import ReservationTableField from "./ReservationTableField";
import ReservationNotesField from "./ReservationNotesField";

import { createReservationDateTime } from "../../../utils/dateUtils";
import { useCreateReservation } from "../hooks/useCreateReservation";

function ReservationForm() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      customerId: "",
      date: undefined,
      time: "",
      guests: undefined,
      tableId: undefined,
      notes: "",
    },
  });

  const { createReservation, isCreating } = useCreateReservation();
  const navigate = useNavigate();

  const selectedDate = useWatch({
    control,
    name: "date",
  });

  const selectedTime = useWatch({
    control,
    name: "time",
  });

  const selectedGuests = useWatch({
    control,
    name: "guests",
  });

  const startsAt =
    selectedDate && selectedTime
      ? createReservationDateTime(selectedDate, selectedTime)
      : undefined;

  const endsAt = startsAt
    ? new Date(startsAt.getTime() + 2 * 60 * 60 * 1000)
    : undefined;

  async function onSubmit(data) {
    const startsAt = createReservationDateTime(data.date, data.time);

    if (startsAt <= new Date()) {
      return;
    }

    const endsAt = new Date(startsAt);

    // Duração atual da reserva: 2 horas.
    endsAt.setHours(endsAt.getHours() + 2);

    const newReservation = {
      customer_id: data.customerId,
      table_id: data.tableId,
      guests: data.guests,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      notes: data.notes || null,
    };

    createReservation(newReservation, {
      onSuccess: () => {
        reset({
          customerId: "",
          date: undefined,
          time: "",
          guests: undefined,
          tableId: undefined,
          notes: "",
        });

        navigate("/reservations");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ReservationCustomerField control={control} />

      <div className="grid gap-4 sm:grid-cols-2">
        <ReservationDateField control={control} />
        <ReservationTimeField control={control} />
      </div>

      <ReservationGuestsField control={control} />

      <ReservationTableField
        control={control}
        startsAt={startsAt?.toISOString()}
        endsAt={endsAt?.toISOString()}
        guests={selectedGuests}
      />

      <ReservationNotesField control={control} />

      <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-gray-700">
        <button
          type="submit"
          disabled={isCreating}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:text-gray-950 dark:hover:bg-emerald-400"
        >
          {isCreating ? "Creating..." : "Create reservation"}
        </button>
      </div>
    </form>
  );
}

export default ReservationForm;
