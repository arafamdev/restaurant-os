import { Controller } from "react-hook-form";

import GuestCountPicker from "./GuestCountPicker";

function ReservationGuestsField({ control }) {
  return (
    <Controller
      name="guests"
      control={control}
      rules={{
        required: "Please select the number of guests.",
        validate: (value) => value > 0 || "Guests must be greater than 0.",
      }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Guests
          </label>

          <GuestCountPicker value={field.value} onChange={field.onChange} />

          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

export default ReservationGuestsField;
