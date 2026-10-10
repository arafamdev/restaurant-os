import Button from "../../../ui/Button";
import { useRestaurantDayPermissions } from "../hooks/useRestaurantDayPermissions";

function RestaurantDayStatus({ restaurantDay, onOpen, onClose }) {
  const {
    canOpenRestaurant,
    canCloseRestaurant,
    isLoading: isPermissionLoading,
  } = useRestaurantDayPermissions();

  const cardStyles =
    "rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#111827] sm:p-6";

  const headingStyles =
    "text-lg font-semibold text-gray-950 dark:text-gray-100";

  const mutedStyles = "text-sm text-gray-500 dark:text-gray-400";

  const valueStyles = "mt-1 font-medium text-gray-900 dark:text-gray-100";

  if (!restaurantDay) {
    return (
      <div className={`${cardStyles} border-gray-200 dark:border-gray-800`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-gray-400" />
              <h2 className={headingStyles}>Restaurant Closed</h2>
            </div>

            <p className={`mt-2 ${mutedStyles}`}>
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
      className={`${cardStyles} ${
        isClosing
          ? "border-amber-200 dark:border-amber-900/60"
          : "border-emerald-200 dark:border-emerald-900/60"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                isClosing ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />

            <h2 className={headingStyles}>
              {isClosing ? "Restaurant Closing" : "Restaurant Open"}
            </h2>
          </div>

          <p className={`mt-2 ${mutedStyles}`}>
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

      <div className="mt-6 grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2 dark:border-gray-800">
        <div>
          <p className={mutedStyles}>Business date</p>
          <p className={valueStyles}>{restaurantDay.business_date}</p>
        </div>

        <div>
          <p className={mutedStyles}>Opened by</p>
          <p className={valueStyles}>
            {restaurantDay.opened_employee?.full_name || "Unknown"}
          </p>
        </div>

        <div>
          <p className={mutedStyles}>Opening cash</p>
          <p className={valueStyles}>
            €{Number(restaurantDay.opening_cash).toFixed(2)}
          </p>
        </div>

        <div>
          <p className={mutedStyles}>Status</p>
          <p
            className={`mt-1 font-semibold capitalize ${
              isClosing
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
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
