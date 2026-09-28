import Button from "../../../ui/Button";

function DailyMenuRow({ dailyMenu, onEdit, onToggleActive, onDelete }) {
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

  return (
    <div className="border-b border-gray-100 px-5 py-5 last:border-b-0">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Main information */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{name}</h3>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {typeLabel}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-5 text-gray-500">
              {description}
            </p>
          )}

          {/* Schedule */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>
              {start_time.slice(0, 5)} – {end_time.slice(0, 5)}
            </span>

            <span>{activeDays.join(" · ")}</span>
          </div>

          {/* Inclusions */}
          {(include_bread || include_coffee) && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
              {include_bread && <span>Includes bread</span>}

              {include_coffee && <span>Includes coffee</span>}
            </div>
          )}
        </div>

        {/* Price + actions */}

        <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}

export default DailyMenuRow;
