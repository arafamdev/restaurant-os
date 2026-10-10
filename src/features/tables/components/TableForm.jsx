import { useForm } from "react-hook-form";
import {
  HiOutlineBuildingStorefront,
  HiOutlineCheckCircle,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineViewfinderCircle,
  HiOutlineXMark,
} from "react-icons/hi2";

import { useCreateTable } from "../hooks/useCreateTable";
import { useUpdateTable } from "../hooks/useUpdateTable";
import { useRestaurants } from "../../staff/hooks/useRestaurants";

import Button from "../../../ui/Button";

function TableForm({ tableToEdit = {}, onSuccess, onCancel, userContext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      tableNumber: tableToEdit.table_number ?? "",
      capacity: tableToEdit.capacity ?? "",
      location: tableToEdit.location ?? "indoor",
      restaurantId: tableToEdit.restaurant_id ?? "",
      status: tableToEdit.status ?? "available",
    },
  });

  const { createTable, isCreating } = useCreateTable();
  const { updateTable, isUpdating } = useUpdateTable();

  const isEditing = Boolean(tableToEdit.id);
  const isPlatformAdmin = Boolean(userContext?.is_platform_admin);

  const {
    restaurants,
    isLoading: isLoadingRestaurants,
    error: restaurantsError,
  } = useRestaurants(!isEditing && isPlatformAdmin);

  const inputClasses = `
    w-full rounded-xl border px-3.5 py-3
    text-sm text-gray-900
    outline-none transition-all duration-200
    placeholder:text-gray-400
    focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
    disabled:cursor-not-allowed disabled:opacity-60
    border-gray-200 bg-gray-50
    dark:border-[#374151] dark:bg-[#0B1120]
    dark:text-[#F9FAFB] dark:placeholder:text-gray-500
    dark:focus:border-emerald-500
  `;

  const labelClasses = `
    mb-2 flex items-center gap-2
    text-sm font-medium text-gray-700
    dark:text-gray-300
  `;

  const iconClasses = "h-4 w-4 text-gray-400";

  function onSubmit(data) {
    const tableData = {
      table_number: data.tableNumber,
      capacity: data.capacity,
      location: data.location,
    };

    if (isEditing) {
      updateTable(
        {
          id: tableToEdit.id,
          updatedTable: {
            ...tableData,
            status: data.status,
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );

      return;
    }

    createTable(
      {
        ...tableData,
        status: "available",
        ...(isPlatformAdmin && {
          restaurant_id: Number(data.restaurantId),
        }),
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      },
    );
  }

  const restaurantOptions =
    restaurants?.map((restaurant) => ({
      value: restaurant.id,
      label: restaurant.name,
    })) ?? [];

  const isLoading = isCreating || isUpdating || isLoadingRestaurants;

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#111827]">
      {/* Cabeçalho */}
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7 dark:border-[#374151]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <HiOutlineViewfinderCircle className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-[#F9FAFB]">
              {isEditing
                ? `Edit table Nº ${tableToEdit.table_number}`
                : "Add a new table"}
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
              {isEditing
                ? "Update the table details, status and seating capacity."
                : "Configure a new table for your restaurant."}
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close form"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none dark:hover:bg-[#1F2937] dark:hover:text-white"
            >
              <HiOutlineXMark className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 px-5 py-6 sm:px-7"
      >
        {/* Erro ao carregar restaurantes */}
        {restaurantsError && !isEditing && isPlatformAdmin && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
          >
            {restaurantsError.message}
          </div>
        )}

        {/* Seleção do restaurante para Platform Admin */}
        {!isEditing && isPlatformAdmin && (
          <div>
            <label htmlFor="restaurantId" className={labelClasses}>
              <HiOutlineBuildingStorefront className={iconClasses} />
              Restaurant
            </label>

            <select
              id="restaurantId"
              {...register("restaurantId", {
                required: "Please select a restaurant.",
              })}
              disabled={isLoadingRestaurants}
              className={inputClasses}
            >
              <option value="">
                {isLoadingRestaurants
                  ? "Loading restaurants..."
                  : "Select a restaurant"}
              </option>

              {restaurantOptions.map((restaurant) => (
                <option key={restaurant.value} value={restaurant.value}>
                  {restaurant.label}
                </option>
              ))}
            </select>

            {errors.restaurantId && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {errors.restaurantId.message}
              </p>
            )}
          </div>
        )}

        {/* Número e capacidade */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tableNumber" className={labelClasses}>
              <HiOutlineViewfinderCircle className={iconClasses} />
              Table number
            </label>

            <input
              id="tableNumber"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 12"
              {...register("tableNumber", {
                required: "Table number is required.",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Enter a number greater than 0.",
                },
                validate: (value) =>
                  Number.isInteger(value) || "Enter a whole number.",
              })}
              className={inputClasses}
            />

            {errors.tableNumber && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {errors.tableNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="capacity" className={labelClasses}>
              <HiOutlineUsers className={iconClasses} />
              Seating capacity
            </label>

            <input
              id="capacity"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 4"
              {...register("capacity", {
                required: "Capacity is required.",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Enter at least 1 seat.",
                },
                validate: (value) =>
                  Number.isInteger(value) || "Enter a whole number.",
              })}
              className={inputClasses}
            />

            {errors.capacity && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {errors.capacity.message}
              </p>
            )}
          </div>
        </div>

        {/* Localização */}
        <div>
          <label htmlFor="location" className={labelClasses}>
            <HiOutlineMapPin className={iconClasses} />
            Table location
          </label>

          <select
            id="location"
            {...register("location", {
              required: "Please select a location.",
            })}
            className={inputClasses}
          >
            <option value="indoor">Indoor — Dining area</option>
            <option value="terrace">Terrace — Outdoor area</option>
          </select>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Choose the area where this table is located.
          </p>

          {errors.location && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Estado da mesa: apenas durante a edição */}
        {isEditing && (
          <div>
            <label htmlFor="status" className={labelClasses}>
              <HiOutlineCheckCircle className={iconClasses} />
              Table status
            </label>

            <select
              id="status"
              {...register("status", {
                required: "Please select a table status.",
              })}
              className={inputClasses}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Update the current availability of this table.
            </p>

            {errors.status && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>
        )}

        {/* Informação contextual */}
        <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
          <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

          <p className="text-xs leading-5 text-emerald-800 dark:text-emerald-300">
            {isEditing
              ? "Your changes will be applied after you save the table."
              : "The new table will be created with the status Available."}
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-end dark:border-[#374151]">
          {onCancel && (
            <Button
              type="button"
              variation="secondary"
              onClick={onCancel}
              disabled={isCreating || isUpdating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={
              isLoading ||
              (!isEditing &&
                isPlatformAdmin &&
                (isLoadingRestaurants || restaurantOptions.length === 0))
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-500 hover:shadow-md focus:ring-4 focus:ring-emerald-500/25 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isCreating || isUpdating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <HiOutlineCheckCircle className="h-5 w-5" />
            )}

            <span>
              {isUpdating
                ? "Saving changes..."
                : isCreating
                  ? "Creating table..."
                  : isEditing
                    ? "Save changes"
                    : "Create table"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TableForm;
