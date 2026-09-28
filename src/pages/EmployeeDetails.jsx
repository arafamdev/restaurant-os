import { format } from "date-fns";
import { useParams } from "react-router-dom";

import { useEmployee } from "../features/staff/hooks/useEmployee";

import BackButton from "../ui/BackButton";
import ErrorMessage from "../ui/ErrorMessage";
import Spinner from "../ui/Spinner";

function EmployeeDetails() {
  const { employeeId } = useParams();

  const { employee, isLoading, error } = useEmployee(employeeId);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message}
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

  return (
    <div className="space-y-6">
      <BackButton to="/staff" label="Back to Staff" />

      <div className="mt-5">
        <h1 className="text-2xl font-semibold text-gray-900">
          {employee.full_name}
        </h1>

        <p className="mt-1 text-sm text-gray-500">Employee details</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Phone</p>

            <p className="mt-1 font-medium text-gray-900">
              {employee.phone || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>

            <p className="mt-1 font-medium text-gray-900 capitalize">
              {employee.roles?.name || "Unknown"}
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
      </div>
    </div>
  );
}

export default EmployeeDetails;
