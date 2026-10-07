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
            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* EMPLOYEE HEADER */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <HiOutlineUserCircle className="h-10 w-10 text-gray-500" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-semibold text-gray-900">
                {employee.full_name}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {employee.restaurant_name ?? "RestaurantOS"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {roleName}
                </span>

                <span className="text-xs text-gray-400">•</span>

                <span className="text-sm text-gray-500">ID #{employee.id}</span>
              </div>
            </div>
          </div>
        </section>

        {/* EMPLOYEE INFORMATION */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Employee information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Basic information associated with this employee.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2">
            {/* EMAIL */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-gray-100 p-2">
                <HiOutlineEnvelope className="h-5 w-5 text-gray-500" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Email
                </p>

                <p className="mt-1 text-sm break-all text-gray-900">
                  {employee.email ?? "—"}
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-gray-100 p-2">
                <HiOutlinePhone className="h-5 w-5 text-gray-500" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Phone
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {employee.phone ?? "—"}
                </p>
              </div>
            </div>

            {/* EMPLOYEE ID */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-gray-100 p-2">
                <HiOutlineIdentification className="h-5 w-5 text-gray-500" />
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Employee ID
                </p>

                <p className="mt-1 text-sm text-gray-900">{employee.id}</p>
              </div>
            </div>

            {/* CREATED */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-gray-100 p-2">
                <HiOutlineCheckCircle className="h-5 w-5 text-gray-500" />
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Created
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {formattedCreatedAt}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ROLE & PERMISSIONS */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <HiOutlineShieldCheck className="h-5 w-5 text-gray-500" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Role & permissions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Change the employee's role and access level.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div className="max-w-md">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Employee role
              </label>

              <Select
                value={Number(roleId)}
                onChange={handleRoleChange}
                options={roleOptions}
              />

              <p className="mt-2 text-xs text-gray-500">
                The selected role determines the employee's default permissions.
              </p>
            </div>

            {isChangingRole && (
              <p className="text-sm text-gray-500">Updating role...</p>
            )}

            {changeRoleError && (
              <ErrorMessage>{changeRoleError.message}</ErrorMessage>
            )}
          </div>
        </section>

        {/* EMPLOYEE STATUS */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Employee status</h2>

            <p className="mt-1 text-sm text-gray-500">
              Control whether this employee can actively use the restaurant
              system.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />

                <span className="text-sm font-medium text-gray-900">
                  Account is {isActive ? "active" : "inactive"}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {isActive
                  ? "This employee is currently active and can access RestaurantOS according to their permissions."
                  : "This employee is currently inactive and cannot actively use RestaurantOS."}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus
                ? "Updating..."
                : isActive
                  ? "Deactivate"
                  : "Activate"}
            </Button>
          </div>

          {updateStatusError && (
            <div className="px-5 pb-5">
              <ErrorMessage>{updateStatusError.message}</ErrorMessage>
            </div>
          )}
        </section>

        {/* EMPLOYEE PERMISSIONS */}
        {canManagePermissions && (
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <HiOutlineShieldCheck className="h-5 w-5 text-gray-500" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Employee permissions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage permissions granted specifically to this employee.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setIsPermissionsModalOpen(true)}
              >
                Manage permissions
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* PERMISSIONS MODAL */}
      {canManagePermissions && (
        <EmployeePermissions
          employeeId={Number(employeeId)}
          isOpen={isPermissionsModalOpen}
          onClose={() => setIsPermissionsModalOpen(false)}
        />
      )}
    </>
  );
}
