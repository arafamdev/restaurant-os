import { useState } from "react";
import { HiOutlineUserPlus, HiOutlineUsers } from "react-icons/hi2";

import EmployeeList from "../features/staff/components/EmployeeList";
import CreateEmployeeForm from "../features/staff/components/CreateEmployeeForm";

import useViewMode from "../hooks/useViewMode";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

import { useEmployees } from "../features/staff/hooks/useEmployees";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";

function Staff() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [view, setView] = useViewMode("staff");

  const {
    employees,
    isLoading: isEmployeesLoading,
    error: employeesError,
  } = useEmployees();

  const {
    userContext,
    isLoading: isUserContextLoading,
    error: userContextError,
  } = useCurrentUserContext();

  if (isEmployeesLoading || isUserContextLoading) {
    return <Spinner />;
  }

  if (employeesError) {
    return (
      <ErrorMessage
        message={employeesError.message}
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

  const canCreateEmployee =
    userContext?.is_platform_admin || userContext?.role_name === "manager";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 dark:border-[#374151] dark:bg-[#111827] dark:text-gray-200">
            <HiOutlineUsers className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
              Staff
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage restaurant employees and their roles.
            </p>
          </div>
        </div>

        {canCreateEmployee && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:ring-4 focus:ring-emerald-500/25 focus:outline-none"
          >
            <HiOutlineUserPlus className="h-5 w-5" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Staff list */}
      <EmployeeList employees={employees} view={view} onViewChange={setView} />

      {/* Create employee modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateEmployeeForm
            onClose={() => setIsCreateModalOpen(false)}
            userContext={userContext}
          />
        </Modal>
      )}
    </div>
  );
}

export default Staff;
