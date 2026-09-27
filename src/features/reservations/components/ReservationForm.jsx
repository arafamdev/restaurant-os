import { useForm, useWatch } from "react-hook-form";

import ReservationCustomerField from "./ReservationCustomerField";
import ReservationDateField from "./ReservationDateField";
import ReservationTimeField from "./ReservationTimeField";
import ReservationGuestsField from "./ReservationGuestsField";
import ReservationTableField from "./ReservationTableField";
import ReservationNotesField from "./ReservationNotesField";

import { createReservationDateTime } from "../../../utils/dateUtils";

import { useCreateReservation } from "../hooks/useCreateReservation";
import { useNavigate } from "react-router-dom";

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
      console.log("Reservation date and time must be in the future.");
      return;
    }

    const endsAt = new Date(startsAt);

    // Current reservation duration: 2 hours.
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

      <button
        type="submit"
        disabled={isCreating}
        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCreating ? "Creating..." : "Create reservation"}
      </button>
    </form>
  );
}

export default ReservationForm;
