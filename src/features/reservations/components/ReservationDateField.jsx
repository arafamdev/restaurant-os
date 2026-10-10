import { Controller } from "react-hook-form";

import DatePicker from "../../../ui/DatePicker";

import {
  getToday,
  validateReservationDate,
  isReservationTimeClosedForToday,
  isToday,
} from "../utils/reservationValidation";

function ReservationDateField({ control }) {
  const today = getToday();
  const isTodayClosed = isReservationTimeClosedForToday();

  return (
    <Controller
      name="date"
      control={control}
      rules={{
        required: "Please select a date.",
        validate: validateReservationDate,
      }}
      render={({ field, fieldState: { error } }) => {
        const isSelectedDateToday = field.value ? isToday(field.value) : true;

        const showTodayClosedMessage = isTodayClosed && isSelectedDateToday;

        return (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Date
            </label>

            <DatePicker
              selected={field.value}
              minDate={today}
              disabledDate={isTodayClosed ? today : undefined}
              onSelect={field.onChange}
            />

            {showTodayClosedMessage && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Reservations for today are closed. Please select a future date.
              </p>
            )}

            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

export default ReservationDateField;
