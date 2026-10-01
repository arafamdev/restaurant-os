import { useState } from "react";

import EmployeeList from "../features/staff/components/EmployeeList";
import CreateEmployeeForm from "../features/staff/components/CreateEmployeeForm";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

import { useEmployees } from "../features/staff/hooks/useEmployees";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";

function Staff() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage restaurant employees and their roles.
          </p>
        </div>

        {canCreateEmployee && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Add Employee
          </Button>
        )}
      </div>

      <EmployeeList employees={employees} />

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
