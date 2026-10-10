import { Controller } from "react-hook-form";

function ReservationNotesField({ control }) {
  return (
    <Controller
      name="notes"
      control={control}
      render={({ field }) => (
        <div>
          <label
            htmlFor="reservation-notes"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Notes
          </label>

          <textarea
            {...field}
            id="reservation-notes"
            rows={4}
            placeholder="Window seat preferred..."
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/10"
          />
        </div>
      )}
    />
  );
}

export default ReservationNotesField;
