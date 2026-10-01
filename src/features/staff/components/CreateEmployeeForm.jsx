import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";

import { useCreateEmployee } from "../hooks/useCreateEmployee";
import { useRestaurants } from "../hooks/useRestaurants";
import { useRoles } from "../hooks/useRole";

function CreateEmployeeForm({ onClose, userContext }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const { roles, isLoading: isLoadingRoles } = useRoles();

  const { restaurants, isLoading: isLoadingRestaurants } = useRestaurants();

  const { createEmployee, isPending, error } = useCreateEmployee();

  const isPlatformAdmin = userContext?.is_platform_admin;
  const isManager = userContext?.role_name === "manager";

  // Usar o primeiro role disponível como valor inicial.
  const selectedRoleId = roleId || roles?.[0]?.id || "";

  // Platform Admin pode escolher qualquer restaurante.
  // Manager utiliza automaticamente o seu próprio restaurante.
  const selectedRestaurantId = isPlatformAdmin
    ? restaurantId || restaurants?.[0]?.id || ""
    : userContext?.restaurant_id || "";

  const roleOptions =
    roles?.map((role) => ({
      value: role.id,
      label: role.name,
    })) ?? [];

  const restaurantOptions =
    restaurants?.map((restaurant) => ({
      value: restaurant.id,
      label: restaurant.name,
    })) ?? [];

  function handleSubmit(event) {
    event.preventDefault();

    createEmployee(
      {
        email,
        full_name: fullName,
        phone,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Add Employee</h2>

        <p className="mt-1 text-sm text-gray-500">
          {isPlatformAdmin
            ? "Send an invitation to a new restaurant employee."
            : `Add a new employee to ${
                userContext?.restaurant_name ?? "your restaurant"
              }.`}
        </p>
      </div>

      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Full name
        </label>

        <Input
          id="fullName"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Enter employee name"
          required
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

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

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Phone
        </label>

        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+351 900 000 000"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Role
        </label>

        <Select
          value={selectedRoleId}
          onChange={setRoleId}
          options={roleOptions}
        />
      </div>

      {isPlatformAdmin && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Restaurant
          </label>

          <Select
            value={selectedRestaurantId}
            onChange={setRestaurantId}
            options={restaurantOptions}
          />
        </div>
      )}

      {isManager && (
        <div>
          <p className="mb-1.5 block text-sm font-medium text-gray-700">
            Restaurant
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
            {userContext?.restaurant_name ?? "Your restaurant"}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
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
        >
          {isPending ? "Sending..." : "Send Invitation"}
        </Button>
      </div>
    </form>
  );
}

export default CreateEmployeeForm;
