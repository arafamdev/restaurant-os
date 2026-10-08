import { useForm } from "react-hook-form";

import { useCreateTable } from "../hooks/useCreateTable";
import { useUpdateTable } from "../hooks/useUpdateTable";
import { useRestaurants } from "../../staff/hooks/useRestaurants";

import Button from "../../../ui/Button";

function TableForm({ tableToEdit = {}, onSuccess, userContext }) {
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
          updatedTable: tableData,
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? "Edit Table" : "Add new table"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEditing
            ? "Update the table information"
            : "Create a new table for the restaurant."}
        </p>
      </div>

      {restaurantsError && !isEditing && isPlatformAdmin && (
        <p className="mb-4 text-sm text-red-600">{restaurantsError.message}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isEditing && isPlatformAdmin && (
          <div>
            <label
              htmlFor="restaurantId"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Restaurant
            </label>

            <select
              id="restaurantId"
              {...register("restaurantId", {
                required: "Restaurant is required",
              })}
              disabled={isLoadingRestaurants}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
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
              <p className="mt-1.5 text-sm text-red-600">
                {errors.restaurantId.message}
              </p>
            )}
          </div>
        )}

        {/* Table number */}
        <div>
          <label
            htmlFor="tableNumber"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Table number
          </label>

          <input
            id="tableNumber"
            type="number"
            {...register("tableNumber", {
              required: "Table number is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Table number must be greater than 0",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          {errors.tableNumber && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.tableNumber.message}
            </p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label
            htmlFor="capacity"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Capacity
          </label>

          <input
            id="capacity"
            type="number"
            {...register("capacity", {
              required: "Capacity is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Capacity must be greater than 0",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          {errors.capacity && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.capacity.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Location
          </label>

          <select
            id="location"
            {...register("location")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="indoor">Indoor</option>
            <option value="terrace">Terrace</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating
              ? "Updating..."
              : isCreating
                ? "Creating..."
                : isEditing
                  ? "Update table"
                  : "Add table"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TableForm;
