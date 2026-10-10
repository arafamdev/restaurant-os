import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineBeaker,
  HiOutlineCake,
  HiOutlineCheckCircle,
  HiOutlinePhoto,
  HiOutlineTag,
  HiOutlineXCircle,
} from "react-icons/hi2";

import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

import MenuItemForm from "../features/menu/components/MenuItemForm";
import useMenuItem from "../features/menu/hooks/useMenuItem";
import { useUpdateMenuItem } from "../features/menu/hooks/useUpdateMenuItem";

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
          className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
          {getDietaryLabel(attribute)}
        </span>
      ))}

      {hiddenDietaryCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
          +{hiddenDietaryCount}
        </span>
      )}

      {visibleAllergens.map((allergen) => (
        <span
          key={`allergen-${allergen.id}`}
          className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
        >
          {getAllergenLabel(allergen)}
        </span>
      ))}

      {hiddenAllergenCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
          +{hiddenAllergenCount}
        </span>
      )}
    </div>
  );
}

function MenuItemDetails() {
  const navigate = useNavigate();
  const { menuItemId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [menuItemToToggle, setMenuItemToToggle] = useState(null);

  const { menuItem, isLoading, error } = useMenuItem(menuItemId);

  const { updateItem, isUpdating } = useUpdateMenuItem();

  function handleConfirmToggleActive() {
    if (!menuItemToToggle) {
      return;
    }

    const nextIsActive = !menuItemToToggle.is_active;

    updateItem(
      {
        id: menuItemToToggle.id,
        updatedMenuItem: {
          is_active: nextIsActive,
        },
      },
      {
        onSuccess: () => {
          setMenuItemToToggle(null);
        },
      },
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!menuItem) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menu item not found.
        </p>
      </div>
    );
  }

  const {
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

  const groupType = menu_categories?.group_type;

  const PlaceholderIcon =
    groupType === "drink"
      ? HiOutlineBeaker
      : groupType === "food"
        ? HiOutlineCake
        : HiOutlinePhoto;

  const categoryName = menu_categories?.name || "Uncategorized";

  const status = !is_active
    ? "Inactive"
    : !is_available
      ? "Unavailable"
      : "Available";

  const statusStyles = {
    Available:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    Unavailable:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300",
    Inactive: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300",
  };

  const statusDotStyles = {
    Available: "bg-emerald-500",
    Unavailable: "bg-yellow-500",
    Inactive: "bg-gray-400",
  };

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`} />
      {status}
    </span>
  );

  function handleBack() {
    navigate(-1);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCloseEdit() {
    if (!isUpdating) {
      setIsEditing(false);
    }
  }

  function handleToggleActive() {
    setMenuItemToToggle(menuItem);
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="small"
              variation="secondary"
              onClick={handleBack}
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                Menu item
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
                {name}
              </h1>
            </div>
          </div>

          <div>{statusBadge}</div>
        </div>

        {/* MAIN CONTENT */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#1F2937]">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            {/* IMAGE */}
            <div className="min-h-[320px] bg-gray-100 lg:min-h-[520px] dark:bg-gray-800">
              {image_url ? (
                <img
                  src={image_url}
                  alt={name}
                  className="h-full min-h-[320px] w-full object-cover lg:min-h-[520px]"
                />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center bg-gray-950 text-gray-400 lg:min-h-[520px] dark:bg-[#0B1120]">
                  <PlaceholderIcon className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="flex flex-col p-6 sm:p-8">
              {/* CATEGORY */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <HiOutlineTag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span>{categoryName}</span>
              </div>

              {/* NAME + PRICE */}
              <div className="mt-6">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
                  {name}
                </h2>

                <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-gray-100">
                  €{Number(price).toFixed(2)}
                </p>
              </div>

              {/* DESCRIPTION */}
              {description && (
                <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-100">
                    Description
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              )}

              {/* DIETARY ATTRIBUTES */}
              {dietaryAttributes.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="h-4 w-4 text-emerald-500" />

                    <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-100">
                      Dietary attributes
                    </h3>
                  </div>

                  <div className="mt-3">
                    <AttributeBadges dietaryAttributes={dietaryAttributes} />
                  </div>
                </div>
              )}

              {/* ALLERGENS */}
              {allergens.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <HiOutlineXCircle className="h-4 w-4 text-amber-500" />

                    <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-100">
                      Allergens
                    </h3>
                  </div>

                  <div className="mt-3">
                    <AttributeBadges allergens={allergens} />
                  </div>
                </div>
              )}

              {/* AVAILABILITY */}
              <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-100">
                      Availability
                    </h3>

                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {is_active
                        ? "Current menu availability"
                        : "This item is inactive and cannot be ordered"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`}
                    />

                    {status}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-auto border-t border-gray-100 pt-6 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      {/* EDIT MENU ITEM MODAL */}
      {isEditing && (
        <Modal onClose={handleCloseEdit}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit menu item
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update this menu item.
            </p>
          </div>

          <MenuItemForm
            menuItemToEdit={menuItem}
            onCloseModal={() => setIsEditing(false)}
          />
        </Modal>
      )}

      {/* DEACTIVATE / REACTIVATE MODAL */}
      {menuItemToToggle && (
        <Modal
          onClose={() => {
            if (!isUpdating) {
              setMenuItemToToggle(null);
            }
          }}
        >
          <div className="text-gray-900 dark:text-gray-100">
            <h2 className="text-xl font-semibold">
              {menuItemToToggle.is_active
                ? "Deactivate menu item"
                : "Reactivate menu item"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Are you sure you want to{" "}
              {menuItemToToggle.is_active ? "deactivate" : "reactivate"}{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {menuItemToToggle.name}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variation="secondary"
                disabled={isUpdating}
                onClick={() => setMenuItemToToggle(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variation={menuItemToToggle.is_active ? "danger" : "primary"}
                disabled={isUpdating}
                onClick={handleConfirmToggleActive}
              >
                {isUpdating
                  ? "Updating..."
                  : menuItemToToggle.is_active
                    ? "Deactivate"
                    : "Reactivate"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default MenuItemDetails;
