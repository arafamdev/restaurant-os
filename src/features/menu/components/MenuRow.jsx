import {
  HiOutlineBeaker,
  HiOutlineCake,
  HiOutlinePhoto,
} from "react-icons/hi2";

import Button from "../../../ui/Button";

function MenuRow({ menuItem, onEdit, onToggleActive }) {
  const {
    name,
    description,
    price,
    image_url,
    is_active,
    is_available,
    menu_categories,
  } = menuItem;

  const status = !is_active
    ? "Inactive"
    : !is_available
      ? "Unavailable"
      : "Available";

  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-700",
    Unavailable: "bg-yellow-50 text-yellow-700",
    Inactive: "bg-gray-100 text-gray-600",
  };

  const groupType = menu_categories?.group_type;

  const PlaceholderIcon =
    groupType === "drink"
      ? HiOutlineBeaker
      : groupType === "food"
        ? HiOutlineCake
        : HiOutlinePhoto;

  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling?.classList.remove(
                  "hidden",
                );
              }}
            />
          ) : null}

          <div
            className={`flex h-full w-full items-center justify-center ${
              image_url ? "hidden" : ""
            }`}
          >
            <PlaceholderIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-medium text-gray-900">{name}</h3>

          <p className="mt-1 text-xs font-medium text-gray-400">
            {menu_categories?.name}
          </p>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-5 text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
        <div className="flex items-center gap-3">
          <p className="text-base font-semibold text-gray-900">
            €{Number(price).toFixed(2)}
          </p>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="small"
            variation="secondary"
            onClick={() => onEdit(menuItem)}
          >
            Edit
          </Button>

          <Button
            size="small"
            variation={is_active ? "danger" : "secondary"}
            onClick={() => onToggleActive(menuItem)}
          >
            {is_active ? "Deactivate" : "Reactivate"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MenuRow;
