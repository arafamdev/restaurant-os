import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";

import { useRestaurantContext } from "../../../context/useRestaurantContext";

import { useMenuCategories } from "../hooks/useMenuCategories";
import { useCreateMenuItem } from "../hooks/useCreateMenuItem";
import { useUpdateMenuItem } from "../hooks/useUpdateMenuItem";

import { useRestaurants } from "../../restaurants/hooks/useRestaurants";

function MenuItemForm({ menuItemToEdit = null, onCloseModal }) {
  const isEditSession = menuItemToEdit?.id != null;
  const editId = menuItemToEdit?.id;

  const { restaurantId: contextRestaurantId, isPlatformAdmin } =
    useRestaurantContext();

  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const categoryRestaurantId = isEditSession
    ? (menuItemToEdit.restaurant_id ?? contextRestaurantId)
    : contextRestaurantId === "all"
      ? selectedRestaurantId
      : contextRestaurantId;

  const {
    categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useMenuCategories(categoryRestaurantId);

  const { restaurants = [], isLoading: isLoadingRestaurants } =
    useRestaurants();

  const { createItem, isCreating } = useCreateMenuItem();
  const { updateItem, isUpdating } = useUpdateMenuItem();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession
      ? {
          name: menuItemToEdit.name ?? "",
          description: menuItemToEdit.description ?? "",
          category_id:
            menuItemToEdit.category_id != null
              ? String(menuItemToEdit.category_id)
              : "",
          price:
            menuItemToEdit.price != null ? String(menuItemToEdit.price) : "",
          image_url: menuItemToEdit.image_url ?? "",
          is_active: menuItemToEdit.is_active ?? true,
          is_available: menuItemToEdit.is_available ?? true,
        }
      : {
          name: "",
          description: "",
          category_id: "",
          price: "",
          image_url: "",
          is_active: true,
          is_available: true,
        },
  });

  const imageUrl = useWatch({
    control,
    name: "image_url",
  });

  // Limpar a categoria quando muda o restaurante.
  useEffect(() => {
    if (isEditSession) return;

    setValue("category_id", "");
    clearErrors("category_id");
  }, [categoryRestaurantId, isEditSession, setValue, clearErrors]);

  const categoryOptions = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      value: String(category.id),
      label: category.name,
    }));

  const restaurantOptions = restaurants.map((restaurant) => ({
    value: String(restaurant.id),
    label: restaurant.name,
  }));

  const selectedRestaurant = restaurants.find(
    (restaurant) =>
      Number(restaurant.id) ===
      Number(
        isEditSession ? menuItemToEdit.restaurant_id : selectedRestaurantId,
      ),
  );

  const isWorking = isCreating || isUpdating;

  const canSubmitCreate =
    isEditSession ||
    Boolean(
      selectedRestaurantId &&
      !isLoadingRestaurants &&
      Number(selectedRestaurantId) > 0,
    );

  function onSubmit(data) {
    if (isLoadingCategories) {
      return;
    }

    const restaurantId = Number(categoryRestaurantId);
    const categoryId = Number(data.category_id);

    // Validar o restaurante.
    if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
      setError("category_id", {
        type: "validate",
        message: "Select a valid restaurant first.",
      });

      return;
    }

    // Confirmar que a categoria pertence ao restaurante.
    const categoryBelongsToRestaurant = categories.some(
      (category) =>
        Number(category.id) === categoryId &&
        Number(category.restaurant_id) === restaurantId &&
        category.is_active,
    );

    if (!categoryBelongsToRestaurant) {
      setError("category_id", {
        type: "validate",
        message: "Select an active category belonging to this restaurant.",
      });

      return;
    }

    clearErrors("category_id");

    const menuItem = {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      category_id: categoryId,
      price: Number(data.price),
      image_url: data.image_url?.trim() || null,
      is_active: data.is_active,
      is_available: data.is_available,
    };

    if (isEditSession) {
      updateItem(
        {
          id: editId,
          updatedMenuItem: menuItem,
        },
        {
          onSuccess: () => {
            onCloseModal?.();
          },
        },
      );

      return;
    }

    createItem(
      {
        ...menuItem,
        restaurant_id: restaurantId,
      },
      {
        onSuccess: () => {
          onCloseModal?.();
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 text-gray-900 dark:text-gray-100"
    >
      {!isEditSession && isPlatformAdmin && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Restaurant
          </label>

          {contextRestaurantId === "all" ? (
            <Select
              value={selectedRestaurantId}
              onChange={setSelectedRestaurantId}
              options={[
                {
                  value: "",
                  label: "Select a restaurant",
                },
                ...restaurantOptions,
              ]}
            />
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {selectedRestaurant?.name ??
                (isLoadingRestaurants
                  ? "Loading restaurant..."
                  : "Restaurant not found")}
            </div>
          )}
        </div>
      )}

      {!isEditSession && !isPlatformAdmin && (
        <div>
          <p className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Restaurant
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {selectedRestaurant?.name ?? "Your restaurant"}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>

        <Input
          type="text"
          {...register("name", {
            required: "Name is required.",
            validate: (value) => Boolean(value.trim()) || "Name is required.",
          })}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>

        <textarea
          rows={3}
          {...register("description")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-[#111827] dark:text-gray-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>

        <Controller
          name="category_id"
          control={control}
          rules={{
            required: "Category is required.",
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Select
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  clearErrors("category_id");
                }}
                options={[
                  {
                    value: "",
                    label: isLoadingCategories
                      ? "Loading categories..."
                      : categoriesError
                        ? "Unable to load categories"
                        : categoryOptions.length === 0
                          ? "No active categories available"
                          : "Select a category",
                  },
                  ...categoryOptions,
                ]}
              />

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Price
        </label>

        <Input
          type="number"
          step="0.01"
          min="0"
          {...register("price", {
            required: "Price is required.",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Price cannot be negative.",
            },
            validate: (value) =>
              Number.isFinite(value) || "Enter a valid price.",
          })}
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Image URL
        </label>

        <Input
          type="url"
          placeholder="https://..."
          {...register("image_url")}
        />

        {imageUrl && (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <img
              src={imageUrl}
              alt="Menu item preview"
              className="h-48 w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("is_active")}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Active
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("is_available")}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Available
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isWorking || !canSubmitCreate || isLoadingCategories}
        >
          {isCreating
            ? "Creating..."
            : isUpdating
              ? "Updating..."
              : isEditSession
                ? "Update item"
                : "Create item"}
        </Button>
      </div>
    </form>
  );
}

export default MenuItemForm;
