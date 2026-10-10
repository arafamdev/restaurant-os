import RestaurantTableIcon from "../../../ui/RestaurantTableIcon";
import Spinner from "../../../ui/Spinner";
import ErrorMessage from "../../../ui/ErrorMessage";
import { useAvailableTables } from "../hooks/useAvailableTables";

function AvailableTables({ startsAt, endsAt, guests, value, onChange }) {
  const { availableTables, isLoading, error } = useAvailableTables({
    startsAt,
    endsAt,
    guests,
  });

  if (!startsAt || !endsAt || !guests) {
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message="Could not load available tables." />;
  }

  if (availableTables.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/40">
        <p className="font-medium text-gray-700 dark:text-gray-200">
          No tables available
        </p>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          There are no available tables for this date, time, and number of
          guests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Available tables
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Select a table for your reservation.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {availableTables.map((table) => {
          const isSelected = table.id === value;

          return (
            <button
              key={table.id}
              type="button"
              onClick={() => onChange(table.id)}
              aria-pressed={isSelected}
              className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/20 dark:border-emerald-400 dark:bg-emerald-500/10 dark:ring-emerald-400/20"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/70 dark:border-gray-700 dark:bg-[#111827] dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/5"
              }`}
            >
              <RestaurantTableIcon
                shape={table.capacity <= 4 ? "round" : "square"}
                status={isSelected ? "selected" : "available"}
              />

              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Table {table.table_number}
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {table.capacity} seats
                </p>

                {table.location && (
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {table.location}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AvailableTables;
