function RestaurantDaySummary({ restaurantDay }) {
  if (!restaurantDay || restaurantDay.status !== "closed") {
    return null;
  }

  const openedAt = restaurantDay.opened_at
    ? new Date(restaurantDay.opened_at).toLocaleString("pt-PT")
    : "Unknown";

  const closedAt = restaurantDay.closed_at
    ? new Date(restaurantDay.closed_at).toLocaleString("pt-PT")
    : "Unknown";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-gray-400" />

        <h2 className="text-lg font-semibold text-gray-900">
          Last Restaurant Day
        </h2>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Summary of the most recently closed Restaurant Day.
      </p>

      {/* Business date */}
      <div className="mt-6 border-b border-gray-100 pb-6">
        <p className="text-sm text-gray-500">Business date</p>

        <p className="mt-1 font-medium text-gray-900">
          {restaurantDay.business_date}
        </p>
      </div>

      {/* Opening & Closing */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Opening Summary */}
        <div className="rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-500" />

            <h3 className="text-base font-semibold text-gray-900">
              Opening Summary
            </h3>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Opened by</p>

              <p className="mt-1 font-medium text-gray-900">
                {restaurantDay.opened_employee?.full_name || "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Opened at</p>

              <p className="mt-1 font-medium text-gray-900">{openedAt}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Opening cash</p>

              <p className="mt-1 font-medium text-gray-900">
                €{Number(restaurantDay.opening_cash).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Closing Summary */}
        <div className="rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />

            <h3 className="text-base font-semibold text-gray-900">
              Closing Summary
            </h3>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Closed by</p>

              <p className="mt-1 font-medium text-gray-900">
                {restaurantDay.closed_employee?.full_name || "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Closed at</p>

              <p className="mt-1 font-medium text-gray-900">{closedAt}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Closing cash</p>

              <p className="mt-1 font-medium text-gray-900">
                €{Number(restaurantDay.closing_cash).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <p className="text-sm text-gray-500">Status</p>

        <p className="mt-1 font-medium text-gray-600 capitalize">
          {restaurantDay.status}
        </p>
      </div>

      {/* Notes */}
      {restaurantDay.notes && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-500">Notes</p>

          <p className="mt-1 text-sm text-gray-900">{restaurantDay.notes}</p>
        </div>
      )}
    </div>
  );
}

export default RestaurantDaySummary;
