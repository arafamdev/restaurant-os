import { Controller, useWatch } from "react-hook-form";

import TimeSlotPicker from "./TimeSlotPicker";

import {
  isTimeInThePast,
  validateReservationTime,
} from "../utils/reservationValidation";

function ReservationTimeField({ control }) {
  const selectedDate = useWatch({
    control,
    name: "date",
  });

  return (
    <Controller
      name="time"
      control={control}
      rules={{
        required: "Please select a time.",
        validate: (value) => validateReservationTime(selectedDate, value),
      }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Time
          </label>

          <TimeSlotPicker
            value={field.value}
            onChange={field.onChange}
            isTimeDisabled={(time) => isTimeInThePast(selectedDate, time)}
          />

          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default ReservationTimeField;
