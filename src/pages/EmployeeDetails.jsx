import { useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useEmployee } from "../features/staff/hooks/useEmployee";
import { useRoles } from "../features/staff/hooks/useRoles";
import { useChangeEmployeeRole } from "../features/staff/hooks/useChangeEmployeeRole";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";

import BackButton from "../ui/BackButton";
import Button from "../ui/Button";
import Select from "../ui/Select";
import ErrorMessage from "../ui/ErrorMessage";
import Spinner from "../ui/Spinner";

function EmployeeDetails() {
  const { employeeId } = useParams();

  const [selectedRoleId, setSelectedRoleId] = useState("");

  const {
    employee,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useEmployee(employeeId);

  const { roles, isLoading: isRolesLoading, error: rolesError } = useRoles();

  const {
    userContext,
    isLoading: isUserContextLoading,
    error: userContextError,
  } = useCurrentUserContext();

  const {
    changeRole,
    isPending: isChangingRole,
    error: changeRoleError,
  } = useChangeEmployeeRole();

  if (isEmployeeLoading || isRolesLoading || isUserContextLoading) {
    return <Spinner />;
  }

  if (employeeError) {
    return (
      <ErrorMessage
        message={employeeError.message}
        backLabel="Back to Staff"
        backTo="/staff"
      />
    );
  }

  if (rolesError) {
    return (
      <ErrorMessage
        message={rolesError.message}
        backLabel="Back to Staff"
        backTo="/staff"
      />
    );
  }

  if (userContextError) {
    return (
      <ErrorMessage
        message={userContextError.message}
        backLabel="Back to Staff"
        backTo="/staff"
      />
    );
  }

  if (!employee) {
    return (
      <ErrorMessage
        message="The requested employee could not be found."
        backLabel="Back to Staff"
        backTo="/staff"
      />
    );
  }

  const canChangeRole =
    userContext?.is_platform_admin ||
    (userContext?.role_name === "manager" &&
      userContext?.restaurant_id === employee.restaurant_id);

  const currentRoleId = employee.roles?.id;

  const selectedRole = selectedRoleId || currentRoleId || "";

  const roleOptions =
    roles?.map((role) => ({
      value: role.id,
      label: role.name,
    })) ?? [];

  function handleRoleChange() {
    if (!selectedRole || selectedRole === currentRoleId) {
      return;
    }

    changeRole(
      {
        employeeId: employee.id,
        roleId: Number(selectedRole),
      },
      {
        onSuccess: () => {
          toast.success("Employee role updated successfully.");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <BackButton to="/staff" label="Back to Staff" />

      <div className="mt-5">
        <h1 className="text-2xl font-semibold text-gray-900">
          {employee.full_name}
        </h1>

        <p className="mt-1 text-sm text-gray-500">Employee details</p>
      </div>

      {/* Info */}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-1 font-medium text-gray-900">
            {employee.email || "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="mt-1 font-medium text-gray-900">
            {employee.phone || "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="mt-1 font-medium text-gray-900 capitalize">
            {employee.role_name || "Unknown"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Restaurant</p>
          <p className="mt-1 font-medium text-gray-900">
            {employee.restaurant_name || "Unknown"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>

          <span
            className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
              employee.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <span
              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                employee.status === "active" ? "bg-green-500" : "bg-gray-400"
              }`}
            />

            {employee.status}
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-500">Employee ID</p>
          <p className="mt-1 font-medium text-gray-900">{employee.id}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Created</p>
          <p className="mt-1 font-medium text-gray-900">
            {format(new Date(employee.created_at), "dd/MM/yyyy, HH:mm")}
          </p>
        </div>
      </div>

      {canChangeRole && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Change role</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update this employee's role.
            </p>
          </div>

          <div className="mt-5 max-w-sm">
            <Select
              value={selectedRole}
              onChange={setSelectedRoleId}
              options={roleOptions}
            />
          </div>

          {changeRoleError && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {changeRoleError.message}
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleRoleChange}
              disabled={
                isChangingRole ||
                !selectedRole ||
                selectedRole === currentRoleId
              }
            >
              {isChangingRole ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDetails;
