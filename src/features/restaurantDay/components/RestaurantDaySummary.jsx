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

  const cardStyles =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827] sm:p-6";

  const mutedStyles = "text-sm text-gray-500 dark:text-gray-400";

  const valueStyles = "mt-1 font-medium text-gray-900 dark:text-gray-100";

  const sectionStyles =
    "rounded-xl border border-gray-200 p-4 dark:border-gray-700 dark:bg-[#0B1120]/50 sm:p-5";

  return (
    <div className={cardStyles}>
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-gray-400" />

        <h2 className="text-lg font-semibold text-gray-950 dark:text-gray-100">
          Last Restaurant Day
        </h2>
      </div>

      <p className={`mt-2 ${mutedStyles}`}>
        Summary of the most recently closed Restaurant Day.
      </p>

      <div className="mt-6 border-b border-gray-100 pb-5 dark:border-gray-800">
        <p className={mutedStyles}>Business date</p>
        <p className={valueStyles}>{restaurantDay.business_date}</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className={sectionStyles}>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />

            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Opening Summary
            </h3>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className={mutedStyles}>Opened by</p>
              <p className={valueStyles}>
                {restaurantDay.opened_employee?.full_name || "Unknown"}
              </p>
            </div>

            <div>
              <p className={mutedStyles}>Opened at</p>
              <p className={valueStyles}>{openedAt}</p>
            </div>

            <div>
              <p className={mutedStyles}>Opening cash</p>
              <p className={valueStyles}>
                €{Number(restaurantDay.opening_cash).toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        <section className={sectionStyles}>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />

            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Closing Summary
            </h3>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className={mutedStyles}>Closed by</p>
              <p className={valueStyles}>
                {restaurantDay.closed_employee?.full_name || "Unknown"}
              </p>
            </div>

            <div>
              <p className={mutedStyles}>Closed at</p>
              <p className={valueStyles}>{closedAt}</p>
            </div>

            <div>
              <p className={mutedStyles}>Closing cash</p>
              <p className={valueStyles}>
                €{Number(restaurantDay.closing_cash).toFixed(2)}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
        <p className={mutedStyles}>Status</p>
        <p className="mt-1 font-semibold text-gray-600 capitalize dark:text-gray-300">
          {restaurantDay.status}
        </p>
      </div>

      {restaurantDay.notes && (
        <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-800">
          <p className={mutedStyles}>Notes</p>
          <p className="mt-1 text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">
            {restaurantDay.notes}
          </p>
        </div>
      )}
    </div>
  );
}

export default RestaurantDaySummary;
