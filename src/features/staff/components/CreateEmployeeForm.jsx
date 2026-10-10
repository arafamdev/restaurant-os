import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";

import { useRestaurantContext } from "../../../context/useRestaurantContext";
import { useCreateEmployee } from "../hooks/useCreateEmployee";
import { useRestaurants } from "../hooks/useRestaurants";
import { useRoles } from "../hooks/useRoles";

function CreateEmployeeForm({ onClose, userContext }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");

  // null significa que ainda não existe uma seleção manual.
  const [selectedRestaurantOverride, setSelectedRestaurantOverride] =
    useState(null);

  const { restaurantId: contextRestaurantId, isPlatformAdmin } =
    useRestaurantContext();

  const isManager = userContext?.role_name === "manager";

  const { roles, isLoading: isLoadingRoles, error: rolesError } = useRoles();

  const {
    restaurants,
    isLoading: isLoadingRestaurants,
    error: restaurantsError,
  } = useRestaurants();

  const { createEmployee, isPending, error } = useCreateEmployee();

  const formError = error || rolesError || restaurantsError;

  // Utiliza o primeiro cargo disponível como valor inicial.
  const selectedRoleId = roleId || roles?.[0]?.id || "";

  // O Platform Admin pode selecionar um restaurante manualmente.
  // Se o contexto estiver em "all", é obrigatório escolher um restaurante.
  // O Manager utiliza sempre o restaurante associado à sua conta.
  const selectedRestaurantId = isPlatformAdmin
    ? selectedRestaurantOverride !== null
      ? selectedRestaurantOverride
      : contextRestaurantId === "all"
        ? ""
        : String(contextRestaurantId ?? "")
    : String(userContext?.restaurant_id ?? "");

  const roleOptions =
    roles?.map((role) => ({
      value: String(role.id),
      label: role.name,
    })) ?? [];

  const restaurantOptions =
    restaurants?.map((restaurant) => ({
      value: String(restaurant.id),
      label: restaurant.name,
    })) ?? [];

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedRoleId || !selectedRestaurantId) return;

    createEmployee(
      {
        email: email.trim(),
        full_name: fullName.trim(),
        phone: phone.trim(),
        role_id: Number(selectedRoleId),
        restaurant_id: Number(selectedRestaurantId),
      },
      {
        onSuccess: () => {
          toast.success("Employee invitation sent successfully.");
          onClose();
        },
      },
    );
  }

  const isLoading = isLoadingRoles || isLoadingRestaurants;

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-[#D1D5DB]";

  const inputWrapperClass =
    "[&_input]:w-full [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-white [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400 [&_input]:focus:border-emerald-500 [&_input]:focus:ring-emerald-500 dark:[&_input]:border-[#374151] dark:[&_input]:bg-[#0B1120] dark:[&_input]:text-[#F9FAFB] dark:[&_input]:placeholder:text-gray-500";

  const selectWrapperClass =
    "[&_select]:w-full [&_select]:rounded-xl [&_select]:border-gray-300 [&_select]:bg-white [&_select]:text-gray-900 [&_select]:focus:border-emerald-500 [&_select]:focus:ring-emerald-500 dark:[&_select]:border-[#374151] dark:[&_select]:bg-[#0B1120] dark:[&_select]:text-[#F9FAFB]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* CABEÇALHO */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-[#F9FAFB]">
          Add Employee
        </h2>

        <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-[#9CA3AF]">
          {isPlatformAdmin
            ? "Send an invitation to a new restaurant employee."
            : `Add a new employee to ${
                userContext?.restaurant_name ?? "your restaurant"
              }.`}
        </p>
      </div>

      {/* NOME */}
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Full name
        </label>

        <div className={inputWrapperClass}>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Enter employee name"
            required
            disabled={isPending}
          />
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>

        <div className={inputWrapperClass}>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="employee@example.com"
            required
            disabled={isPending}
          />
        </div>
      </div>

      {/* TELEFONE */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>

        <div className={inputWrapperClass}>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+351 900 000 000"
            disabled={isPending}
          />
        </div>
      </div>

      {/* CARGO */}
      <div>
        <label htmlFor="employeeRole" className={labelClass}>
          Role
        </label>

        <div className={selectWrapperClass}>
          <Select
            id="employeeRole"
            value={String(selectedRoleId)}
            onChange={setRoleId}
            options={roleOptions}
            disabled={isPending || isLoadingRoles}
          />
        </div>
      </div>

      {/* RESTAURANTE DO PLATFORM ADMIN */}
      {isPlatformAdmin && (
        <div>
          <label htmlFor="employeeRestaurant" className={labelClass}>
            Restaurant
          </label>

          <div className={selectWrapperClass}>
            <Select
              id="employeeRestaurant"
              value={String(selectedRestaurantId)}
              onChange={setSelectedRestaurantOverride}
              options={[
                {
                  value: "",
                  label: "Select a restaurant",
                },
                ...restaurantOptions,
              ]}
              disabled={isPending || isLoadingRestaurants}
            />
          </div>
        </div>
      )}

      {/* RESTAURANTE DO MANAGER */}
      {isManager && (
        <div>
          <p className={labelClass}>Restaurant</p>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-[#374151] dark:bg-[#0B1120] dark:text-[#D1D5DB]">
            {userContext?.restaurant_name ?? "Your restaurant"}
          </div>
        </div>
      )}

      {/* ERROS */}
      {formError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {formError.message}
        </p>
      )}

      {/* AÇÕES */}
      <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row dark:border-[#374151]">
        <Button
          type="button"
          variation="secondary"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isPending || isLoading || !selectedRoleId || !selectedRestaurantId
          }
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:ring-4 focus:ring-emerald-500/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Invitation"}
        </Button>
      </div>
    </form>
  );
}

export default CreateEmployeeForm;
