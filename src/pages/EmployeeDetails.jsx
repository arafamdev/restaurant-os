import { useState } from "react";

import { format } from "date-fns";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  HiOutlineArrowLeft,
  HiOutlineBriefcase,
  HiOutlineBuildingStorefront,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineUserMinus,
  HiOutlineUserPlus,
} from "react-icons/hi2";

import { useEmployee } from "../features/staff/hooks/useEmployee";
import { useRoles } from "../features/staff/hooks/useRoles";
import { useChangeEmployeeRole } from "../features/staff/hooks/useChangeEmployeeRole";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";
import { useUpdateEmployeeStatus } from "../features/staff/hooks/useUpdateEmployeeStatus";

import BackButton from "../ui/BackButton";
import Button from "../ui/Button";
import Select from "../ui/Select";
import ErrorMessage from "../ui/ErrorMessage";
import Spinner from "../ui/Spinner";

function formatRole(roleName) {
  if (!roleName) {
    return "Unknown role";
  }

  return roleName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function InfoItem({ icon: Icon, label, value, muted = false }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-sm font-medium ${
            muted ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-base font-semibold tracking-tight text-gray-950">
          {title}
        </h2>

        <p className="mt-0.5 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function EmployeeDetails() {
  const { employeeId } = useParams();

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

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

  const {
    updateStatus,
    isPending: isUpdatingStatus,
    error: updateStatusError,
  } = useUpdateEmployeeStatus();

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

  const canChangeStatus =
    userContext?.is_platform_admin ||
    (userContext?.role_name === "manager" &&
      userContext?.restaurant_id === employee.restaurant_id);

  const currentRoleId = employee.role_id || employee.roles?.id;

  const selectedRole = selectedRoleId || currentRoleId || "";

  const roleOptions =
    roles?.map((role) => ({
      value: role.id,
      label: formatRole(role.name),
    })) ?? [];

  const isActive = employee.status === "active";

  const roleLabel = formatRole(employee.role_name || employee.roles?.name);

  const initials = getInitials(employee.full_name);

  function handleRoleChange() {
    if (!selectedRole || Number(selectedRole) === Number(currentRoleId)) {
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

  function handleStatusChange() {
    if (isActive) {
      setShowStatusModal(true);
      return;
    }

    updateStatus(
      {
        employeeId: employee.id,
        status: "active",
      },
      {
        onSuccess: () => {
          toast.success("Employee activated successfully.");
        },
      },
    );
  }

  function handleConfirmDeactivate() {
    updateStatus(
      {
        employeeId: employee.id,
        status: "inactive",
      },
      {
        onSuccess: () => {
          setShowStatusModal(false);
          toast.success("Employee deactivated successfully.");
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackButton to="/staff" label="Back to Staff" />

      {/* Employee hero */}
      <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="h-1 bg-gray-950" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Identity */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-xl font-semibold tracking-tight text-white shadow-sm">
                  {initials}
                </div>

                <span
                  className={`absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-[3px] border-white ${
                    isActive ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-semibold tracking-tight text-gray-950">
                    {employee.full_name}
                  </h1>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />

                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <HiOutlineBriefcase className="h-4 w-4 shrink-0" />
                  {roleLabel}
                </p>

                <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-400">
                  <HiOutlineEnvelope className="h-4 w-4 shrink-0" />
                  {employee.email || "No email available"}
                </p>
              </div>
            </div>

            {/* Role badge */}
            <div className="hidden rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 sm:block">
              <p className="text-[10px] font-bold tracking-[0.14em] text-gray-400 uppercase">
                Current role
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-950">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Employee information */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
        <SectionHeader
          icon={HiOutlineUserCircle}
          title="Employee information"
          description="Basic information associated with this employee."
        />

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            icon={HiOutlinePhone}
            label="Phone"
            value={employee.phone || "Not provided"}
            muted={!employee.phone}
          />

          <InfoItem
            icon={HiOutlineBuildingStorefront}
            label="Restaurant"
            value={employee.restaurant_name || "Unknown"}
          />

          <InfoItem
            icon={HiOutlineIdentification}
            label="Employee ID"
            value={employee.id}
          />

          <InfoItem
            icon={HiOutlineCalendarDays}
            label="Created"
            value={format(new Date(employee.created_at), "dd/MM/yyyy, HH:mm")}
          />
        </div>
      </section>

      {/* Role management */}
      {canChangeRole && (
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeader
            icon={HiOutlineShieldCheck}
            title="Role & permissions"
            description="Change the employee's role and access level."
          />

          <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full max-w-md">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Employee role
                </label>

                <Select
                  value={selectedRole}
                  onChange={setSelectedRoleId}
                  options={roleOptions}
                />

                <p className="mt-2 text-xs text-gray-400">
                  The selected role determines the employee's default
                  permissions.
                </p>
              </div>

              <Button
                onClick={handleRoleChange}
                disabled={
                  isChangingRole ||
                  !selectedRole ||
                  Number(selectedRole) === Number(currentRoleId)
                }
              >
                {isChangingRole ? "Updating..." : "Update role"}
              </Button>
            </div>

            {changeRoleError && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <span className="text-sm font-bold">!</span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to update role
                  </p>

                  <p className="mt-0.5 text-sm text-red-600">
                    {changeRoleError.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Status management */}
      {canChangeStatus && (
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeader
            icon={isActive ? HiOutlineUserMinus : HiOutlineUserPlus}
            title="Employee status"
            description="Control whether this employee can actively use the restaurant system."
          />

          <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isActive ? (
                  <HiOutlineCheckCircle className="h-5 w-5" />
                ) : (
                  <HiOutlineUserMinus className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-950">
                    Account is {isActive ? "active" : "inactive"}
                  </p>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500">
                  {isActive
                    ? "This employee is currently active and can access RestaurantOS according to their permissions."
                    : "This employee is currently inactive and should not be able to use the restaurant system."}
                </p>
              </div>
            </div>

            <Button
              onClick={handleStatusChange}
              disabled={isUpdatingStatus}
              variation={isActive ? "danger" : "primary"}
            >
              {isUpdatingStatus
                ? "Updating..."
                : isActive
                  ? "Deactivate"
                  : "Activate"}
            </Button>
          </div>

          {updateStatusError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <span className="text-sm font-bold">!</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to update status
                </p>

                <p className="mt-0.5 text-sm text-red-600">
                  {updateStatusError.message}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Deactivate confirmation modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-employee-title"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <HiOutlineUserMinus className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2
                  id="deactivate-employee-title"
                  className="text-base font-semibold text-gray-950"
                >
                  Deactivate employee
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Are you sure you want to deactivate{" "}
                  <span className="font-semibold text-gray-700">
                    {employee.full_name}
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variation="secondary"
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdatingStatus}
              >
                Cancel
              </Button>

              <Button
                variation="danger"
                onClick={handleConfirmDeactivate}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Deactivating..." : "Deactivate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDetails;
