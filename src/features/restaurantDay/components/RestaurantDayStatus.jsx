import Button from "../../../ui/Button";

function RestaurantDayStatus({ restaurantDay, onOpen, onClose }) {
  if (!restaurantDay) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-gray-400" />

              <h2 className="text-lg font-semibold text-gray-900">
                Restaurant Closed
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              No Restaurant Day is currently open.
            </p>
          </div>

          <Button onClick={onOpen}>Open Restaurant Day</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-500" />

            <h2 className="text-lg font-semibold text-gray-900">
              Restaurant Open
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            The restaurant is currently operating.
          </p>
        </div>

        <Button variation="danger" onClick={onClose}>
          Close Restaurant Day
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Business date</p>

          <p className="mt-1 font-medium text-gray-900">
            {restaurantDay.business_date}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Opened by</p>

          <p className="mt-1 font-medium text-gray-900">
            {restaurantDay.opened_employee?.full_name || "Unknown"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Opening cash</p>

          <p className="mt-1 font-medium text-gray-900">
            €{Number(restaurantDay.opening_cash).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>

          <p className="mt-1 font-medium text-green-600 capitalize">
            {restaurantDay.status}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDayStatus;
