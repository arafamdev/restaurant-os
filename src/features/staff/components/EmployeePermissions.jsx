import { useState } from "react";

import {
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import Button from "../../../ui/Button";
import Select from "../../../ui/Select";
import Spinner from "../../../ui/Spinner";

import { useEmployeePermissions } from "../hooks/useEmployeePermissions";
import { useGrantEmployeePermission } from "../hooks/useGrantEmployeePermission";
import { usePermissions } from "../hooks/usePermissions";
import { useRevokeEmployeePermission } from "../hooks/useRevokeEmployeePermission";

function EmployeePermissions({ employeeId, isOpen, onClose }) {
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
    isLoading: isCatalogLoading,
    error: catalogError,
  } = usePermissions();

  const {
    grantPermission,
    isPending: isGranting,
    error: grantError,
  } = useGrantEmployeePermission();

  const {
    revokePermission,
    isPending: isRevoking,
    error: revokeError,
  } = useRevokeEmployeePermission();

  const [selectedPermissionId, setSelectedPermissionId] = useState("");

  if (!isOpen) {
    return null;
  }

  /*
   * IDs das permissões que o funcionário já possui
   * através do role ou de permissões individuais.
   */
  const effectivePermissionIds =
    effectivePermissions?.map((permission) =>
      Number(permission.permission_id),
    ) ?? [];

  /*
   * Apenas permissões que o funcionário ainda NÃO possui
   * podem aparecer no Select para serem atribuídas.
   */
  const availablePermissions =
    permissions?.filter(
      (permission) => !effectivePermissionIds.includes(Number(permission.id)),
    ) ?? [];

  const permissionOptions = availablePermissions.map((permission) => ({
    value: permission.id,
    label: permission.name,
  }));

  function handlePermissionChange(permissionId) {
    setSelectedPermissionId(permissionId);
  }

  function handleGrantPermission() {
    const permissionId = Number(selectedPermissionId);

    if (!permissionId) {
      return;
    }

    grantPermission(
      {
        employeeId: Number(employeeId),
        permissionId,
      },
      {
        onSuccess: () => {
          toast.success("Permission granted successfully.");
          setSelectedPermissionId("");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  function handleRevokePermission(permissionId) {
    revokePermission(
      {
        employeeId: Number(employeeId),
        permissionId: Number(permissionId),
      },
      {
        onSuccess: () => {
          toast.success("Individual permission removed successfully.");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  if (
    isEmployeePermissionsLoading ||
    isEffectivePermissionsLoading ||
    isCatalogLoading
  ) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="flex min-h-[220px] w-full max-w-2xl items-center justify-center rounded-xl bg-white shadow-2xl">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2">
              <HiOutlineShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Employee permissions
              </h2>

              <p className="text-sm text-gray-500">
                Manage permissions for this employee.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto bg-white px-5 py-5">
          {/* EFFECTIVE PERMISSIONS */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900">
              Effective permissions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              All permissions currently available to this employee through their
              role or individual assignments.
            </p>

            {effectivePermissionsError && (
              <p className="mt-3 text-sm text-red-600">
                {effectivePermissionsError.message}
              </p>
            )}

            {!effectivePermissionsError && effectivePermissions?.length > 0 && (
              <div className="mt-4 space-y-2">
                {effectivePermissions.map((permission) => (
                  <div
                    key={permission.permission_id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <HiOutlineCheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />

                      <span className="truncate text-sm font-medium text-gray-800">
                        {permission.permission_name}
                      </span>
                    </div>

                    <span className="ml-4 shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500 ring-1 ring-gray-200">
                      {permission.source === "role + individual"
                        ? "Role + Individual"
                        : permission.source === "individual"
                          ? "Individual"
                          : "Role"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!effectivePermissionsError &&
              effectivePermissions?.length === 0 && (
                <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
                  <p className="text-sm text-gray-500">
                    No effective permissions found.
                  </p>
                </div>
              )}
          </section>

          {/* INDIVIDUAL PERMISSIONS */}
          <section className="mt-8 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Individual permissions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Give this employee additional permissions outside their role.
              </p>
            </div>

            {/* GRANT */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-sm">
                <Select
                  value={selectedPermissionId}
                  onChange={handlePermissionChange}
                  options={[
                    {
                      value: "",
                      label:
                        availablePermissions.length > 0
                          ? "Select a permission..."
                          : "No additional permissions",
                    },
                    ...permissionOptions,
                  ]}
                />
              </div>

              <Button
                type="button"
                disabled={!selectedPermissionId || isGranting}
                onClick={handleGrantPermission}
              >
                {isGranting ? "Granting..." : "Grant permission"}
              </Button>
            </div>

            {catalogError && (
              <p className="mt-3 text-sm text-red-600">
                {catalogError.message}
              </p>
            )}

            {grantError && (
              <p className="mt-3 text-sm text-red-600">{grantError.message}</p>
            )}

            {/* INDIVIDUAL GRANTS */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Individually assigned
              </h4>

              {employeePermissions?.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {employeePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <HiOutlineCheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />

                        <span className="truncate text-sm font-medium text-gray-800">
                          {permission.permission_name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRevokePermission(permission.permission_id)
                        }
                        disabled={isRevoking}
                        className="ml-4 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove permission"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center">
                  <p className="text-sm text-gray-500">
                    No individual permissions assigned.
                  </p>
                </div>
              )}
            </div>

            {employeePermissionsError && (
              <p className="mt-3 text-sm text-red-600">
                {employeePermissionsError.message}
              </p>
            )}

            {revokeError && (
              <p className="mt-3 text-sm text-red-600">{revokeError.message}</p>
            )}
          </section>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeePermissions;
