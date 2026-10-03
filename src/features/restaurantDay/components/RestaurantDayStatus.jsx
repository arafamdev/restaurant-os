import Button from "../../../ui/Button";

import { useRestaurantDayPermissions } from "../hooks/useRestaurantDayPermissions";

function RestaurantDayStatus({ restaurantDay, onOpen, onClose }) {
  const {
    canOpenRestaurant,
    canCloseRestaurant,
    isLoading: isPermissionLoading,
  } = useRestaurantDayPermissions();

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

          {!isPermissionLoading && canOpenRestaurant && (
            <Button onClick={onOpen}>Open Restaurant Day</Button>
          )}
        </div>
      </div>
    );
  }

  const isClosing = restaurantDay.status === "closing";

  return (
    <div
      className={`rounded-lg border bg-white p-6 ${
        isClosing ? "border-yellow-200" : "border-green-200"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                isClosing ? "bg-yellow-500" : "bg-green-500"
              }`}
            />

            <h2 className="text-lg font-semibold text-gray-900">
              {isClosing ? "Restaurant Closing" : "Restaurant Open"}
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {isClosing
              ? "The restaurant day is currently being closed."
              : "The restaurant is currently operating."}
          </p>
        </div>

        {!isClosing && !isPermissionLoading && canCloseRestaurant && (
          <Button variation="danger" onClick={onClose}>
            Close Restaurant Day
          </Button>
        )}
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

          <p
            className={`mt-1 font-medium capitalize ${
              isClosing ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {restaurantDay.status}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDayStatus;
