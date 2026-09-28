import { useEffect } from "react";

import { Controller, useFieldArray, useForm } from "react-hook-form";

import toast from "react-hot-toast";

import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";

import { useCreateDailyMenu } from "../hooks/useCreateDailyMenu";
import { useDailyMenu } from "../hooks/useDailyMenu";
import { useUpdateDailyMenu } from "../hooks/useUpdateDailyMenu";

import DailyMenuOptionsField from "./DailyMenuOptionsField";

const defaultFormValues = {
  name: "",
  description: "",
  menu_type: "simple",
  price: "",
  start_time: "12:00",
  end_time: "15:30",

  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,

  include_bread: false,
  include_coffee: false,

  options: [
    {
      component_type: "starter",
      menu_item_id: "",
    },
    {
      component_type: "main",
      menu_item_id: "",
    },
  ],
};

const executiveMenuOptions = [
  {
    component_type: "starter",
    menu_item_id: "",
  },
  {
    component_type: "main",
    menu_item_id: "",
  },
  {
    component_type: "dessert",
    menu_item_id: "",
  },
];

const simpleMenuOptions = [
  {
    component_type: "starter",
    menu_item_id: "",
  },
  {
    component_type: "main",
    menu_item_id: "",
  },
];

const menuTypeOptions = [
  {
    value: "simple",
    label: "Simple",
  },
  {
    value: "executive",
    label: "Executive",
  },
];

const availableDays = [
  {
    value: "monday",
    label: "Monday",
  },
  {
    value: "tuesday",
    label: "Tuesday",
  },
  {
    value: "wednesday",
    label: "Wednesday",
  },
  {
    value: "thursday",
    label: "Thursday",
  },
  {
    value: "friday",
    label: "Friday",
  },
  {
    value: "saturday",
    label: "Saturday",
  },
  {
    value: "sunday",
    label: "Sunday",
  },
];

function validateMenuOptions(menuType, options) {
  const selectedOptions = options.filter((option) => option.menu_item_id);

  if (selectedOptions.length === 0) {
    return "Select at least one menu option.";
  }

  const selectedItemIds = selectedOptions.map((option) => option.menu_item_id);

  const hasDuplicateItems =
    new Set(selectedItemIds).size !== selectedItemIds.length;

  if (hasDuplicateItems) {
    return "The same menu item cannot be selected more than once.";
  }

  const componentTypes = selectedOptions.map((option) => option.component_type);

  const hasStarter = componentTypes.includes("starter");

  const hasMain = componentTypes.includes("main");

  const hasDessert = componentTypes.includes("dessert");

  if (!hasStarter) {
    return "Select at least one starter.";
  }

  if (!hasMain) {
    return "Select at least one main course.";
  }

  if (menuType === "executive" && !hasDessert) {
    return "Select at least one dessert.";
  }

  return true;
}

function DailyMenuForm({ dailyMenu, onCloseModal }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "options",
  });

  const menuType = watch("menu_type");

  const selectedDays = watch([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]);

  const { createDailyMenu, isCreating } = useCreateDailyMenu();

  const { updateDailyMenu, isUpdating } = useUpdateDailyMenu();

  const { dailyMenu: fullDailyMenu, isLoading } = useDailyMenu(dailyMenu?.id);

  const isEditing = Boolean(dailyMenu);

  const isSaving = isCreating || isUpdating;

  function onSubmit(data) {
    const hasSelectedDay = selectedDays.some(Boolean);

    if (!hasSelectedDay) {
      toast.error("Select at least one day.");
      return;
    }

    const optionsError = validateMenuOptions(data.menu_type, data.options);

    if (optionsError !== true) {
      toast.error(optionsError);
      return;
    }

    if (isEditing) {
      updateDailyMenu(
        {
          id: dailyMenu.id,
          ...data,
        },
        {
          onSuccess: () => {
            onCloseModal();
          },
        },
      );

      return;
    }

    createDailyMenu(data, {
      onSuccess: () => {
        onCloseModal();
      },
    });
  }

  useEffect(() => {
    if (!fullDailyMenu) return;

    reset({
      name: fullDailyMenu.name,

      description: fullDailyMenu.description || "",

      menu_type: fullDailyMenu.menu_type,

      price: String(fullDailyMenu.price),

      start_time: fullDailyMenu.start_time.slice(0, 5),

      end_time: fullDailyMenu.end_time.slice(0, 5),

      monday: fullDailyMenu.monday,

      tuesday: fullDailyMenu.tuesday,

      wednesday: fullDailyMenu.wednesday,

      thursday: fullDailyMenu.thursday,

      friday: fullDailyMenu.friday,

      saturday: fullDailyMenu.saturday,

      sunday: fullDailyMenu.sunday,

      include_bread: fullDailyMenu.include_bread,

      include_coffee: fullDailyMenu.include_coffee,

      options: fullDailyMenu.daily_menu_options.map((option) => ({
        component_type: option.component_type,

        menu_item_id: String(option.menu_item_id),
      })),
    });
  }, [fullDailyMenu, reset]);

  if (dailyMenu && isLoading) {
    return <p className="text-sm text-gray-500">Loading daily menu...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic information */}

      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Basic information
        </h3>

        <div className="mt-4 space-y-4">
          {/* Name */}

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <Input
              id="name"
              placeholder="e.g. Daily Lunch"
              {...register("name", {
                required: "Name is required.",
                validate: (value) => value.trim() !== "" || "Name is required.",
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              rows="3"
              placeholder="Describe this daily menu..."
              {...register("description")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Menu type + price */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Menu type */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Menu type
              </label>

              <Controller
                name="menu_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      if (value === "executive") {
                        replace(executiveMenuOptions);

                        return;
                      }

                      replace(simpleMenuOptions);
                    }}
                    options={menuTypeOptions}
                  />
                )}
              />
            </div>

            {/* Price */}

            <div>
              <label
                htmlFor="price"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Price (€)
              </label>

              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="12.90"
                {...register("price", {
                  required: "Price is required.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price cannot be negative.",
                  },
                })}
              />

              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}

      <div>
        <h3 className="text-base font-semibold text-gray-900">Schedule</h3>

        <div className="mt-4 space-y-4">
          {/* Time range */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Start time */}

            <div>
              <label
                htmlFor="start_time"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Start time
              </label>

              <Input
                id="start_time"
                type="time"
                {...register("start_time", {
                  required: "Start time is required.",
                })}
              />

              {errors.start_time && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            {/* End time */}

            <div>
              <label
                htmlFor="end_time"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                End time
              </label>

              <Input
                id="end_time"
                type="time"
                {...register("end_time", {
                  required: "End time is required.",

                  validate: (value) => {
                    const startTime = watch("start_time");

                    if (!startTime || !value) {
                      return true;
                    }

                    return (
                      value > startTime || "End time must be after start time."
                    );
                  },
                })}
              />

              {errors.end_time && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          {/* Available days */}

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              Available days
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {availableDays.map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    {...register(day.value)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />

                  {day.label}
                </label>
              ))}
            </div>

            {!selectedDays.some(Boolean) && (
              <p className="mt-2 text-sm text-red-600">
                Select at least one day.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Inclusions */}

      <div>
        <h3 className="text-base font-semibold text-gray-900">Inclusions</h3>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              {...register("include_bread")}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Include bread
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              {...register("include_coffee")}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Include coffee
          </label>
        </div>
      </div>

      {/* Menu options */}

      <div>
        <h3 className="text-base font-semibold text-gray-900">Menu options</h3>

        <p className="mt-1 text-sm text-gray-500">
          {menuType === "simple"
            ? "A simple menu requires at least one starter and one main course. You can add multiple options."
            : "An executive menu requires at least one starter, one main course and one dessert. You can add multiple options."}
        </p>

        <div className="mt-4">
          <DailyMenuOptionsField
            control={control}
            fields={fields}
            append={append}
            remove={remove}
            menuType={menuType}
          />
        </div>
      </div>

      {/* Actions */}

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
        <Button
          type="button"
          variation="secondary"
          onClick={onCloseModal}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save changes"
              : "Create daily menu"}
        </Button>
      </div>
    </form>
  );
}

export default DailyMenuForm;
