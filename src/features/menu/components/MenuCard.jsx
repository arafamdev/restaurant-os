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
          className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
          {getDietaryLabel(attribute)}
        </span>
      ))}

      {hiddenDietaryCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
          +{hiddenDietaryCount}
        </span>
      )}

      {visibleAllergens.map((allergen) => (
        <span
          key={`allergen-${allergen.id}`}
          className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
        >
          {getAllergenLabel(allergen)}
        </span>
      ))}

      {hiddenAllergenCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
          +{hiddenAllergenCount}
        </span>
      )}
    </div>
  );
}

function MenuCard({
  menuItem,
  view = "compact",
  onEdit,
  onToggleActive,
  canManage = false,
}) {
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

  const status = !is_active
    ? "Inactive"
    : !is_available
      ? "Unavailable"
      : "Available";

  const statusStyles = {
    Available:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    Unavailable:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300",
    Inactive: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300",
  };

  const statusDotStyles = {
    Available: "bg-emerald-500",
    Unavailable: "bg-yellow-500",
    Inactive: "bg-gray-400 dark:bg-gray-500",
  };

  const groupType = menu_categories?.group_type;

  const PlaceholderIcon =
    groupType === "drink"
      ? HiOutlineBeaker
      : groupType === "food"
        ? HiOutlineCake
        : HiOutlinePhoto;

  const categoryName = menu_categories?.name || "Uncategorized";

  const formattedPrice = Number(price).toFixed(2);

  const statusBadge = (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`} />
      {status}
    </span>
  );

  function handleClick() {
    navigate(`/menu/${id}`);
  }

  function handleKeyDown(event) {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  }

  function handleEdit(event) {
    event?.stopPropagation();

    if (!canManage || !onEdit) return;

    onEdit(menuItem);
  }

  function handleToggleActive(event) {
    event?.stopPropagation();

    if (!canManage || !onToggleActive) return;

    onToggleActive(menuItem);
  }

  function handleImageError(event) {
    event.currentTarget.style.display = "none";
  }

  function renderImage() {
    if (image_url) {
      return (
        <img
          src={image_url}
          alt={name}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
        />
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        <PlaceholderIcon className="h-8 w-8" />
      </div>
    );
  }

  function renderActions() {
    if (!canManage) return null;

    return (
      <div
        className="flex flex-wrap gap-2"
        onClick={(event) => event.stopPropagation()}
      >
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
    );
  }

  const interactiveProps = {
    tabIndex: 0,
    role: "link",
    "aria-label": `Open ${name}`,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  // VISTA DE LISTA
  if (view === "list") {
    return (
      <div
        {...interactiveProps}
        className="group flex cursor-pointer flex-col gap-4 border-b border-gray-100 px-4 py-4 transition-colors outline-none last:border-b-0 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-inset sm:px-6 lg:flex-row lg:items-center lg:justify-between dark:border-gray-700 dark:hover:bg-gray-800/60 dark:focus-visible:bg-gray-800/60"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            {renderImage()}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-950 dark:text-gray-100">
              {name}
            </p>

            <p className="mt-1 text-xs text-gray-400">Menu item #{id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <HiOutlineTag className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="text-sm">{categoryName}</span>
        </div>

        <div className="max-w-md min-w-0">
          <AttributeBadges
            dietaryAttributes={dietaryAttributes}
            allergens={allergens}
          />
        </div>

        <div className="text-sm font-semibold text-gray-950 dark:text-gray-100">
          €{formattedPrice}
        </div>

        {statusBadge}

        {renderActions()}
      </div>
    );
  }

  // VISTA COMPACTA
  if (view === "compact") {
    return (
      <article
        {...interactiveProps}
        className="group grid card-hover cursor-pointer grid-cols-[35%_minmax(0,1fr)] overflow-hidden focus-visible:ring-2"
      >
        <div className="relative min-h-[190px] self-stretch overflow-hidden bg-gray-100 sm:min-h-[220px] dark:bg-gray-800">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              loading="lazy"
              onError={handleImageError}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlaceholderIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col p-3 sm:p-4">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-950 sm:text-base dark:text-gray-100">
                {name}
              </h3>

              <p className="mt-1 text-xs text-gray-400">Menu item #{id}</p>
            </div>

            {statusBadge}
          </div>

          <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <HiOutlineTag className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="truncate">{categoryName}</span>
          </div>

          {description && (
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500 sm:text-sm dark:text-gray-400">
              {description}
            </p>
          )}

          <div className="mt-3">
            <AttributeBadges
              dietaryAttributes={dietaryAttributes}
              allergens={allergens}
            />
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
            <span className="text-base font-semibold text-gray-950 sm:text-lg dark:text-gray-100">
              €{formattedPrice}
            </span>

            {renderActions()}
          </div>
        </div>
      </article>
    );
  }

  // VISTA GRANDE
  return (
    <article
      {...interactiveProps}
      className="group flex h-full card-hover cursor-pointer flex-col overflow-hidden focus-visible:ring-2"
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        {statusBadge}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-950 group-hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-600">
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </div>
      </div>

      <div className="px-4 pt-4 sm:px-5">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          {renderImage()}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-gray-950 sm:text-lg dark:text-gray-100">
            {name}
          </h3>

          <p className="mt-1 text-xs text-gray-400">Menu item #{id}</p>

          <p className="mt-3 text-xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
            €{formattedPrice}
          </p>
        </div>

        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <HiOutlineTag className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="truncate">{categoryName}</span>
          </div>

          {description && (
            <p className="line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}

          <AttributeBadges
            dietaryAttributes={dietaryAttributes}
            allergens={allergens}
          />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
          {renderActions()}

          <HiOutlineArrowRight className="h-4 w-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-700 motion-reduce:transition-none dark:text-gray-500 dark:group-hover:text-gray-200" />
        </div>
      </div>
    </article>
  );
}

export default MenuCard;
