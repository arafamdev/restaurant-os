import Button from "../../../ui/Button";

function DailyMenuCard({ dailyMenu, view, onEdit, onToggleActive, onDelete }) {
  const {
    name,
    description,
    menu_type,
    price,
    start_time,
    end_time,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    include_bread,
    include_coffee,
    is_active,
  } = dailyMenu;

  const activeDays = [
    monday && "Mon",
    tuesday && "Tue",
    wednesday && "Wed",
    thursday && "Thu",
    friday && "Fri",
    saturday && "Sat",
    sunday && "Sun",
  ].filter(Boolean);

  const typeLabel = menu_type === "executive" ? "Executive" : "Simple";

  const formattedPrice = Number(price).toFixed(2);

  const statusClass = is_active
    ? "bg-emerald-50 text-emerald-700"
    : "bg-gray-100 text-gray-500";

  function renderActions() {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="small"
          variation="secondary"
          onClick={() => onEdit(dailyMenu)}
        >
          Edit
        </Button>

        <Button
          size="small"
          variation={is_active ? "danger" : "secondary"}
          onClick={() => onToggleActive(dailyMenu)}
        >
          {is_active ? "Deactivate" : "Activate"}
        </Button>

        <Button
          size="small"
          variation="danger"
          onClick={() => onDelete(dailyMenu)}
        >
          Delete
        </Button>
      </div>
    );
  }

  /*
   * LARGE VIEW
   */
  if (view === "large") {
    return (
      <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {typeLabel}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
              >
                {is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xl font-semibold text-gray-900">
              €{formattedPrice}
            </p>

            <p className="mt-1 text-xs text-gray-500">per menu</p>
          </div>
        </div>

        {description && (
          <p className="mt-4 text-sm leading-6 text-gray-500">{description}</p>
        )}

        <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Schedule
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {start_time.slice(0, 5)} – {end_time.slice(0, 5)}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {activeDays.join(" · ")}
            </p>
          </div>

          {(include_bread || include_coffee) && (
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Inclusions
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {include_bread && (
                  <span className="rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
                    Bread
                  </span>
                )}

                {include_coffee && (
                  <span className="rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
                    Coffee
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          {renderActions()}
        </div>
      </article>
    );
  }

  /*
   * COMPACT VIEW
   */
  if (view === "compact") {
    return (
      <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-900">{name}</h3>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                {typeLabel}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass}`}
              >
                {is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <p className="shrink-0 text-lg font-semibold text-gray-900">
            €{formattedPrice}
          </p>
        </div>

        {description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-gray-500">
            {description}
          </p>
        )}

        <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-400">Schedule</span>

            <span className="text-right font-medium text-gray-700">
              {start_time.slice(0, 5)} – {end_time.slice(0, 5)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 text-xs">
            <span className="shrink-0 text-gray-400">Days</span>

            <span className="text-right text-gray-600">
              {activeDays.join(" · ")}
            </span>
          </div>
        </div>

        {(include_bread || include_coffee) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {include_bread && (
              <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-600">
                Bread
              </span>
            )}

            {include_coffee && (
              <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-600">
                Coffee
              </span>
            )}
          </div>
        )}

        <div className="mt-4 border-t border-gray-100 pt-3">
          {renderActions()}
        </div>
      </article>
    );
  }

  /*
   * LIST VIEW
   */
  return (
    <div className="border-b border-gray-100 px-5 py-5 last:border-b-0">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{name}</h3>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {typeLabel}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
            >
              {is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-5 text-gray-500">
              {description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>
              {start_time.slice(0, 5)} – {end_time.slice(0, 5)}
            </span>

            <span>{activeDays.join(" · ")}</span>

            <span className="font-medium text-gray-700">€{formattedPrice}</span>
          </div>

          {(include_bread || include_coffee) && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
              {include_bread && <span>Includes bread</span>}

              {include_coffee && <span>Includes coffee</span>}
            </div>
          )}
        </div>

        <div className="shrink-0">{renderActions()}</div>
      </div>
    </div>
  );
}

export default DailyMenuCard;
