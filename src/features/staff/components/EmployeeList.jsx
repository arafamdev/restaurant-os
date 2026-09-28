function EmployeeList({ employees }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-600">Employee</th>

              <th className="px-6 py-4 font-medium text-gray-600">Phone</th>

              <th className="px-6 py-4 font-medium text-gray-600">Role</th>

              <th className="px-6 py-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {employee.full_name}
                  </p>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {employee.phone || "—"}
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900 capitalize">
                    {employee.roles?.name || "Unknown"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      employee.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
