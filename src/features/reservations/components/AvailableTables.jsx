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
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="font-medium text-gray-700">No tables available</p>

        <p className="mt-1 text-sm text-gray-500">
          There are no available tables for this date, time, and number of
          guests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-gray-700">Available tables</h3>

        <p className="mt-1 text-xs text-gray-500">
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
              className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              <RestaurantTableIcon
                shape={table.capacity <= 4 ? "round" : "square"}
                status={isSelected ? "selected" : "available"}
              />

              <div>
                <p className="font-semibold text-gray-900">
                  Table {table.table_number}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {table.capacity} seats
                </p>

                {table.location && (
                  <p className="mt-1 text-xs text-gray-400">{table.location}</p>
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
