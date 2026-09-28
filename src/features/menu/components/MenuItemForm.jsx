import { Controller, useForm } from "react-hook-form";

import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";

import { useMenuCategories } from "../hooks/useMenuCategories";
import { useCreateMenuItem } from "../hooks/useCreateMenuItem";
import { useUpdateMenuItem } from "../hooks/useUpdateMenuItem";

function MenuItemForm({ menuItemToEdit = null, onCloseModal }) {
  const isEditSession = menuItemToEdit?.id != null;

  const editId = menuItemToEdit?.id;

  const { categories } = useMenuCategories();

  const { createItem, isCreating } = useCreateMenuItem();

  const { updateItem, isUpdating } = useUpdateMenuItem();

  const {
    register,
    handleSubmit,
    watch,
    control,
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

  const imageUrl = watch("image_url");

  const categoryOptions = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      value: String(category.id),
      label: category.name,
    }));

  const isWorking = isCreating || isUpdating;

  function onSubmit(data) {
    const menuItem = {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      category_id: Number(data.category_id),
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

    createItem(menuItem, {
      onSuccess: () => {
        onCloseModal?.();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </label>

        <Input
          type="text"
          {...register("name", {
            required: "Name is required.",
          })}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          rows={3}
          {...register("description")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
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
                onChange={field.onChange}
                options={[
                  {
                    value: "",
                    label: "Select a category",
                  },
                  ...categoryOptions,
                ]}
              />

              {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Price
        </label>

        <Input
          type="number"
          step="0.01"
          min="0"
          {...register("price", {
            required: "Price is required.",
            min: {
              value: 0,
              message: "Price cannot be negative.",
            },
          })}
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Image URL
        </label>

        <Input
          type="url"
          placeholder="https://..."
          {...register("image_url")}
        />

        {imageUrl && (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
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

          <span className="text-sm text-gray-700">Active</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("is_available")}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />

          <span className="text-sm text-gray-700">Available</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>

        <Button type="submit" disabled={isWorking}>
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
