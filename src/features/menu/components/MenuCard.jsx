import { useNavigate } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineBeaker,
  HiOutlineCake,
  HiOutlinePhoto,
  HiOutlineTag,
} from "react-icons/hi2";

import Button from "../../../ui/Button";

const MAX_VISIBLE_DIETARY_ATTRIBUTES = 3;
const MAX_VISIBLE_ALLERGENS = 3;

const dietaryLabels = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  gluten_free: "Gluten Free",
  lactose_free: "Lactose Free",
  spicy: "Spicy",
};

const allergenLabels = {
  gluten_cereals: "Gluten",
  crustaceans: "Crustaceans",
  eggs: "Eggs",
  fish: "Fish",
  peanuts: "Peanuts",
  soybeans: "Soy",
  milk: "Milk",
  nuts: "Nuts",
  celery: "Celery",
  mustard: "Mustard",
  sesame: "Sesame",
  sulphites: "Sulphites",
  lupin: "Lupin",
  molluscs: "Molluscs",
};

function getDietaryLabel(attribute) {
  return dietaryLabels[attribute.code] || attribute.name;
}

function getAllergenLabel(allergen) {
  return allergenLabels[allergen.code] || allergen.name;
}

function AttributeBadges({ dietaryAttributes = [], allergens = [] }) {
  if (!dietaryAttributes.length && !allergens.length) {
    return null;
  }

  const visibleDietaryAttributes = dietaryAttributes.slice(
    0,
    MAX_VISIBLE_DIETARY_ATTRIBUTES,
  );

  const visibleAllergens = allergens.slice(0, MAX_VISIBLE_ALLERGENS);

  const hiddenDietaryCount =
    dietaryAttributes.length - visibleDietaryAttributes.length;

  const hiddenAllergenCount = allergens.length - visibleAllergens.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleDietaryAttributes.map((attribute) => (
        <span
          key={`dietary-${attribute.id}`}
          className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700"
        >
          {getDietaryLabel(attribute)}
        </span>
      ))}

      {hiddenDietaryCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500">
          +{hiddenDietaryCount}
        </span>
      )}

      {visibleAllergens.map((allergen) => (
        <span
          key={`allergen-${allergen.id}`}
          className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700"
        >
          {getAllergenLabel(allergen)}
        </span>
      ))}

      {hiddenAllergenCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500">
          +{hiddenAllergenCount}
        </span>
      )}
    </div>
  );
}

function MenuCard({ menuItem, view = "compact", onEdit, onToggleActive }) {
  const navigate = useNavigate();

  const {
    id,
    name,
    description,
    price,
    image_url,
    is_active,
    is_available,
    menu_categories,
    dietaryAttributes = [],
    allergens = [],
  } = menuItem;

  const isAvailable = is_active && is_available;

  const status = !is_active
    ? "Inactive"
    : !is_available
      ? "Unavailable"
      : "Available";

  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-700",
    Unavailable: "bg-yellow-50 text-yellow-700",
    Inactive: "bg-gray-100 text-gray-500",
  };

  const statusDotStyles = {
    Available: "bg-emerald-500",
    Unavailable: "bg-yellow-500",
    Inactive: "bg-gray-400",
  };

  const groupType = menu_categories?.group_type;

  const PlaceholderIcon =
    groupType === "drink"
      ? HiOutlineBeaker
      : groupType === "food"
        ? HiOutlineCake
        : HiOutlinePhoto;

  const categoryName = menu_categories?.name || "Uncategorized";

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`} />
      {status}
    </span>
  );

  function handleClick() {
    navigate(`/menu/${id}`);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/menu/${id}`);
    }
  }

  function handleEdit(event) {
    event.stopPropagation();
    onEdit(menuItem);
  }

  function handleToggleActive(event) {
    event.stopPropagation();
    onToggleActive(menuItem);
  }

  // ==================================================
  // LIST VIEW
  // ==================================================

  if (view === "list") {
    return (
      <div
        tabIndex={0}
        role="link"
        aria-label={`Open ${name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group flex cursor-pointer flex-col gap-4 border-b border-gray-100 px-6 py-4 transition-colors outline-none last:border-b-0 hover:bg-gray-50/80 focus-visible:bg-gray-50/80 lg:flex-row lg:items-center lg:justify-between"
      >
        {/* MENU ITEM */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-950 text-sm font-semibold tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            {image_url ? (
              <img
                src={image_url}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <PlaceholderIcon className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-950">{name}</p>

            <p className="mt-1 text-xs text-gray-400">Menu item #{id}</p>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="flex items-center gap-2 text-gray-600">
          <HiOutlineTag className="h-4 w-4 shrink-0 text-gray-400" />

          <span className="text-sm">{categoryName}</span>
        </div>

        {/* DIETARY + ALLERGENS */}
        <div className="max-w-md min-w-0">
          <AttributeBadges
            dietaryAttributes={dietaryAttributes}
            allergens={allergens}
          />
        </div>

        {/* PRICE */}
        <div className="text-sm font-semibold text-gray-950">
          €{Number(price).toFixed(2)}
        </div>

        {/* STATUS */}
        <div>{statusBadge}</div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button
            type="button"
            size="small"
            variation="secondary"
            onClick={handleEdit}
          >
            Edit
          </Button>

          <Button
            type="button"
            size="small"
            variation={is_active ? "danger" : "secondary"}
            onClick={handleToggleActive}
          >
            {is_active ? "Deactivate" : "Reactivate"}
          </Button>
        </div>
      </div>
    );
  }

  // ==================================================
  // COMPACT VIEW
  // ==================================================

  if (view === "compact") {
    return (
      <article
        tabIndex={0}
        role="link"
        aria-label={`Open ${name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-950/10"
      >
        <div className="flex items-start gap-3">
          {/* IMAGE */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-950 text-sm font-semibold tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            {image_url ? (
              <img
                src={image_url}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <PlaceholderIcon className="h-5 w-5" />
            )}
          </div>

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-950">
                  {name}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  Menu item #{id}
                </p>
              </div>

              {statusBadge}
            </div>

            {/* CATEGORY */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
              <HiOutlineTag className="h-4 w-4 shrink-0 text-gray-400" />

              <span className="truncate">{categoryName}</span>
            </div>

            {/* DESCRIPTION */}
            {description && (
              <p className="mt-1.5 line-clamp-1 text-xs text-gray-400">
                {description}
              </p>
            )}

            {/* DIETARY + ALLERGENS */}
            <div className="mt-3">
              <AttributeBadges
                dietaryAttributes={dietaryAttributes}
                allergens={allergens}
              />
            </div>

            {/* PRICE + ACTIONS */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-950">
                €{Number(price).toFixed(2)}
              </span>

              <div className="flex gap-1.5">
                <Button
                  type="button"
                  size="small"
                  variation="secondary"
                  onClick={handleEdit}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  size="small"
                  variation={is_active ? "danger" : "secondary"}
                  onClick={handleToggleActive}
                >
                  {is_active ? "Deactivate" : "Reactivate"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ==================================================
  // LARGE VIEW
  // ==================================================

  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={`Open ${name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-950/10"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        {statusBadge}

        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition-all duration-200 group-hover:bg-gray-950 group-hover:text-white">
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* IMAGE */}
      <div className="mt-6 flex justify-center">
        <div className="flex h-28 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100 text-gray-400 shadow-sm transition-transform duration-200 group-hover:scale-[1.02]">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <PlaceholderIcon className="h-9 w-9" />
          )}
        </div>
      </div>

      {/* IDENTITY */}
      <div className="mt-5 text-center">
        <h3 className="truncate text-base font-semibold tracking-tight text-gray-950">
          {name}
        </h3>

        <p className="mt-1 text-xs text-gray-400">Menu item #{id}</p>
      </div>

      {/* PRICE */}
      <div className="mt-3 text-center">
        <span className="text-lg font-semibold tracking-tight text-gray-950">
          €{Number(price).toFixed(2)}
        </span>
      </div>

      {/* DETAILS */}
      <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlineTag className="h-4 w-4 shrink-0 text-gray-400" />

          <span className="truncate">{categoryName}</span>
        </div>

        {description && (
          <p className="line-clamp-2 text-sm leading-5 text-gray-500">
            {description}
          </p>
        )}

        {/* DIETARY + ALLERGENS */}
        <div className="pt-1">
          <AttributeBadges
            dietaryAttributes={dietaryAttributes}
            allergens={allergens}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex gap-2">
          <Button
            type="button"
            size="small"
            variation="secondary"
            onClick={handleEdit}
          >
            Edit
          </Button>

          <Button
            type="button"
            size="small"
            variation={is_active ? "danger" : "secondary"}
            onClick={handleToggleActive}
          >
            {is_active ? "Deactivate" : "Reactivate"}
          </Button>
        </div>

        <HiOutlineArrowRight className="h-4 w-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-700" />
      </div>
    </article>
  );
}

export default MenuCard;
