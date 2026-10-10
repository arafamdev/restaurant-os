import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { toast } from "react-hot-toast";

import BackButton from "../ui/BackButton";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import Select from "../ui/Select";
import Spinner from "../ui/Spinner";

import { useHasPermission } from "../features/auth/hooks/useHasPermission";
import { useChangeEmployeeRole } from "../features/staff/hooks/useChangeEmployeeRole";
import { useEmployee } from "../features/staff/hooks/useEmployee";
import { useRoles } from "../features/staff/hooks/useRoles";
import { useUpdateEmployeeStatus } from "../features/staff/hooks/useUpdateEmployeeStatus";
import EmployeePermissions from "../features/staff/components/EmployeePermissions";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#374151] dark:bg-[#0B1120]">
        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-[#9CA3AF]">
          {label}
        </p>

        <p className="mt-1 text-sm break-words text-gray-900 dark:text-[#F9FAFB]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-200 px-5 py-4 sm:px-6 dark:border-[#374151]">
      <div className="flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#374151] dark:bg-[#0B1120]">
        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="min-w-0">
        <h2 className="font-semibold text-gray-900 dark:text-[#F9FAFB]">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-[#9CA3AF]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeDetails() {
  const { employeeId } = useParams();

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  const {
    employee,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useEmployee(employeeId);

  const { roles, isLoading: isRolesLoading, error: rolesError } = useRoles();

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

  const {
    hasPermission: canManageEmployeePermissions,
    isLoading: isPermissionLoading,
    error: permissionError,
  } = useHasPermission("manage_employee_permissions");

  if (isEmployeeLoading || isRolesLoading || isPermissionLoading) {
    return <Spinner />;
  }

  if (employeeError) {
    return <ErrorMessage>{employeeError.message}</ErrorMessage>;
  }

  if (rolesError) {
    return <ErrorMessage>{rolesError.message}</ErrorMessage>;
  }

  if (permissionError) {
    return <ErrorMessage>{permissionError.message}</ErrorMessage>;
  }

  if (!employee) {
    return <ErrorMessage>Funcionário não encontrado.</ErrorMessage>;
  }

  const roleId = employee.roles?.id ?? employee.role_id;
  const roleName = employee.roles?.name ?? employee.role_name ?? "—";
  const isActive = employee.status === "active";

  const canManagePermissions =
    employee.is_platform_admin || canManageEmployeePermissions;

  const roleOptions =
    roles?.map((role) => ({
      value: role.id,
      label: role.name,
    })) ?? [];

  function handleRoleChange(newRoleId) {
    const normalizedRoleId = Number(newRoleId);

    if (!normalizedRoleId || normalizedRoleId === Number(roleId)) {
      return;
    }

    changeRole(
      {
        employeeId: Number(employeeId),
        roleId: normalizedRoleId,
      },
      {
        onSuccess: () => {
          toast.success("Função atualizada com sucesso.");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  function handleStatusChange() {
    const newStatus = isActive ? "inactive" : "active";

    updateStatus(
      {
        employeeId: Number(employeeId),
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "active"
              ? "Funcionário ativado com sucesso."
              : "Funcionário desativado com sucesso.",
          );
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  const formattedCreatedAt = employee.created_at
    ? new Date(employee.created_at).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-6 pb-10">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4">
          <BackButton to="/staff" />

          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isActive
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-red-500 dark:bg-red-400"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* EMPLOYEE HEADER */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-[#374151] dark:bg-[#111827]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <HiOutlineUserCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                Employee profile
              </p>

              <h1 className="text-2xl font-semibold tracking-tight break-words text-gray-950 dark:text-[#F9FAFB]">
                {employee.full_name}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
                {employee.restaurant_name ?? "RestaurantOS"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {roleName}
                </span>

                <span className="text-gray-300 dark:text-[#4B5563]">•</span>

                <span className="text-sm text-gray-500 dark:text-[#9CA3AF]">
                  ID #{employee.id}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* EMPLOYEE INFORMATION */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#374151] dark:bg-[#111827]">
          <SectionHeader
            icon={HiOutlineIdentification}
            title="Employee information"
            description="Basic information associated with this employee."
          />

          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
            <InfoItem
              icon={HiOutlineEnvelope}
              label="Email"
              value={employee.email}
            />

            <InfoItem
              icon={HiOutlinePhone}
              label="Phone"
              value={employee.phone}
            />

            <InfoItem
              icon={HiOutlineIdentification}
              label="Employee ID"
              value={employee.id}
            />

            <InfoItem
              icon={HiOutlineCheckCircle}
              label="Created"
              value={formattedCreatedAt}
            />
          </div>
        </section>

        {/* ROLE & PERMISSIONS */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#374151] dark:bg-[#111827]">
          <SectionHeader
            icon={HiOutlineShieldCheck}
            title="Role & permissions"
            description="Change the employee's role and access level."
          />

          <div className="space-y-5 p-5 sm:p-6">
            <div className="max-w-md">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#D1D5DB]">
                Employee role
              </label>

              <div className="[&_select]:w-full [&_select]:rounded-xl [&_select]:border-gray-300 [&_select]:bg-white [&_select]:text-gray-900 [&_select]:focus:border-emerald-500 [&_select]:focus:ring-emerald-500 dark:[&_select]:border-[#374151] dark:[&_select]:bg-[#0B1120] dark:[&_select]:text-[#F9FAFB]">
                <Select
                  value={Number(roleId)}
                  onChange={handleRoleChange}
                  options={roleOptions}
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-[#9CA3AF]">
                The selected role determines the employee's default permissions.
              </p>
            </div>

            {isChangingRole && (
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Updating role...
              </p>
            )}

            {changeRoleError && (
              <ErrorMessage>{changeRoleError.message}</ErrorMessage>
            )}
          </div>
        </section>

        {/* EMPLOYEE STATUS */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#374151] dark:bg-[#111827]">
          <SectionHeader
            icon={HiOutlineCheckCircle}
            title="Employee status"
            description="Control whether this employee can actively use the restaurant system."
          />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    isActive
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-red-500 dark:bg-red-400"
                  }`}
                />

                <span className="text-sm font-medium text-gray-900 dark:text-[#F9FAFB]">
                  Account is {isActive ? "active" : "inactive"}
                </span>
              </div>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-[#9CA3AF]">
                {isActive
                  ? "This employee is currently active and can access RestaurantOS according to their permissions."
                  : "This employee is currently inactive and cannot actively use RestaurantOS."}
              </p>
            </div>

            <div className="shrink-0">
              <Button
                type="button"
                onClick={handleStatusChange}
                disabled={isUpdatingStatus}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                  isActive
                    ? "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/20"
                    : "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500/20"
                }`}
              >
                {isUpdatingStatus
                  ? "Updating..."
                  : isActive
                    ? "Deactivate"
                    : "Activate"}
              </Button>
            </div>
          </div>

          {updateStatusError && (
            <div className="px-5 pb-5 sm:px-6">
              <ErrorMessage>{updateStatusError.message}</ErrorMessage>
            </div>
          )}
        </section>

        {/* EMPLOYEE PERMISSIONS */}
        {canManagePermissions && (
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#374151] dark:bg-[#111827]">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#374151] dark:bg-[#0B1120]">
                  <HiOutlineShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 dark:text-[#F9FAFB]">
                    Employee permissions
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-[#9CA3AF]">
                    Manage permissions granted specifically to this employee.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <Button
                  type="button"
                  onClick={() => setIsPermissionsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:ring-4 focus:ring-emerald-500/25 focus:outline-none"
                >
                  <HiOutlineShieldCheck className="h-5 w-5" />
                  Manage permissions
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* PERMISSIONS MODAL */}
      <EmployeePermissions
        employeeId={Number(employeeId)}
        roleName={roleName}
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
      />
    </>
  );
}
