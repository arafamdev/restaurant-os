import { Controller } from "react-hook-form";

import AvailableTables from "./AvailableTables";

function ReservationTableField({ control, startsAt, endsAt, guests }) {
  return (
    <Controller
      name="tableId"
      control={control}
      rules={{
        required: "Please select a table.",
      }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <AvailableTables
            startsAt={startsAt}
            endsAt={endsAt}
            guests={guests}
            value={field.value}
            onChange={field.onChange}
          />

          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default ReservationTableField;
