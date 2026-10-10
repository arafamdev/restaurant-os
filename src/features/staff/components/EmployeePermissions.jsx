import { useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "react-hot-toast";

import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import Select from "../../../ui/Select";
import Spinner from "../../../ui/Spinner";
import { useEmployeePermissions } from "../hooks/useEmployeePermissions";
import { useGrantEmployeePermission } from "../hooks/useGrantEmployeePermission";
import { usePermissions } from "../hooks/usePermissions";
import { useRevokeEmployeePermission } from "../hooks/useRevokeEmployeePermission";

function formatPermissionName(permissionName) {
  if (!permissionName) return "";

  return permissionName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSourceLabel(source) {
  switch (source) {
    case "role":
      return "Role";
    case "individual":
      return "Individual";
    case "role + individual":
      return "Role + Individual";
    default:
      return source;
  }
}

function getSourceClassName(source) {
  switch (source) {
    case "role":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
    case "individual":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
    case "role + individual":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-[#111827] dark:text-[#D1D5DB]";
  }
}

function EmployeePermissions({ employeeId, roleName, isOpen, onClose }) {
  const [selectedPermissionId, setSelectedPermissionId] = useState("");

  const isManager = roleName === "manager";

  const {
    permissions: employeePermissions,
    effectivePermissions,
    isPermissionsLoading: isEmployeePermissionsLoading,
    isEffectivePermissionsLoading,
    permissionsError: employeePermissionsError,
    effectivePermissionsError,
  } = useEmployeePermissions(employeeId);

  const {
    permissions,
    isLoading: isPermissionsLoading,
    error: permissionsError,
  } = usePermissions();

  const { grantPermission, isGranting } = useGrantEmployeePermission();

  const { revokePermission, isRevoking } = useRevokeEmployeePermission();

  if (!isOpen) return null;

  const isLoading =
    isEmployeePermissionsLoading ||
    isEffectivePermissionsLoading ||
    isPermissionsLoading;

  const error =
    employeePermissionsError || effectivePermissionsError || permissionsError;

  const effectivePermissionIds = new Set(
    (effectivePermissions ?? []).map((permission) =>
      Number(permission.permission_id),
    ),
  );

  const availablePermissions = (permissions ?? []).filter(
    (permission) => !effectivePermissionIds.has(Number(permission.id)),
  );

  function handleGrant() {
    if (!selectedPermissionId) return;

    grantPermission(
      {
        employeeId,
        permissionId: Number(selectedPermissionId),
      },
      {
        onSuccess: () => {
          toast.success("Permission granted successfully.");
          setSelectedPermissionId("");
        },
      },
    );
  }

  function handleRevoke(permissionId) {
    revokePermission(
      {
        employeeId,
        permissionId: Number(permissionId),
      },
      {
        onSuccess: () => {
          toast.success("Individual permission removed successfully.");
        },
      },
    );
  }

  return (
    <Modal onClose={onClose} size="large" closeOnOverlayClick closeOnEscape>
      {/* CABEÇALHO */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-5 dark:border-[#374151]">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#F9FAFB]">
            Employee permissions
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
            Manage permissions granted specifically to this employee.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-[#9CA3AF] dark:hover:bg-[#374151] dark:hover:text-[#F9FAFB]"
          aria-label="Close"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="max-h-[65vh] overflow-y-auto py-5">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}

        {!isLoading && error && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {error.message}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-6">
            {/* PERMISSÕES EFETIVAS */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineShieldCheck className="h-5 w-5 text-gray-600 dark:text-[#9CA3AF]" />

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-[#F9FAFB]">
                    Effective permissions
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-[#9CA3AF]">
                    Permissions currently available to this employee.
                  </p>
                </div>
              </div>

              {isManager && (
                <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
                  This employee is a manager. Their permissions are determined
                  by the manager role.
                </div>
              )}

              {effectivePermissions?.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-[#374151] dark:text-[#9CA3AF]">
                  No effective permissions found.
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {(effectivePermissions ?? []).map((permission) => (
                    <div
                      key={permission.permission_id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-[#374151] dark:bg-[#111827]"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                        <span className="truncate text-sm font-medium text-gray-800 dark:text-[#F9FAFB]">
                          {formatPermissionName(permission.permission_name)}
                        </span>
                      </div>

                      <span
                        className={`ml-2 shrink-0 rounded-full px-2 py-1 text-xs font-medium ${getSourceClassName(
                          permission.source,
                        )}`}
                      >
                        {getSourceLabel(permission.source)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* PERMISSÕES INDIVIDUAIS */}
            {!isManager && (
              <section className="border-t border-gray-200 pt-6 dark:border-[#374151]">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-[#F9FAFB]">
                    Individual permissions
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-[#9CA3AF]">
                    Add or remove permissions specifically assigned to this
                    employee.
                  </p>
                </div>

                {/* ATRIBUIR PERMISSÃO */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Select
                      value={selectedPermissionId}
                      onChange={setSelectedPermissionId}
                      options={[
                        {
                          value: "",
                          label: "Select a permission",
                        },
                        ...availablePermissions.map((permission) => ({
                          value: permission.id,
                          label: formatPermissionName(permission.name),
                        })),
                      ]}
                      disabled={isGranting}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleGrant}
                    disabled={!selectedPermissionId || isGranting}
                  >
                    {isGranting ? "Granting..." : "Grant permission"}
                  </Button>
                </div>

                {/* LISTA DE PERMISSÕES INDIVIDUAIS */}
                <div className="mt-4 space-y-2">
                  {employeePermissions?.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-[#374151] dark:text-[#9CA3AF]">
                      No individual permissions assigned.
                    </div>
                  ) : (
                    (employeePermissions ?? []).map((permission) => (
                      <div
                        key={permission.permission_id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 dark:border-[#374151] dark:bg-[#111827]"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                          <span className="text-sm font-medium text-gray-800 dark:text-[#F9FAFB]">
                            {formatPermissionName(permission.permission_name)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRevoke(permission.permission_id)}
                          disabled={isRevoking}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#9CA3AF] dark:hover:bg-red-950/40 dark:hover:text-red-300"
                          title="Remove individual permission"
                          aria-label={`Remove ${formatPermissionName(
                            permission.permission_name,
                          )} permission`}
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* RODAPÉ */}
      <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-[#374151]">
        <Button type="button" variation="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default EmployeePermissions;
