import EmployeeList from "../features/staff/components/EmployeeList";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

import { useEmployees } from "../features/staff/hooks/useEmployees";

function Staff() {
  const { employees, isLoading, error } = useEmployees();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Staff</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage restaurant employees and their roles.
        </p>
      </div>

      <EmployeeList employees={employees} />
    </div>
  );
}

export default Staff;
