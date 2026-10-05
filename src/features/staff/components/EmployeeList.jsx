import { useMemo, useState } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineUserMinus,
} from "react-icons/hi2";

import EmployeeCard from "./EmployeeCard";
import ViewSwitcher from "../../../ui/ViewSwitcher";

function EmployeeList({ employees, view = "compact", onViewChange }) {
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const total = employees?.length ?? 0;

    const active =
      employees?.filter((employee) => employee.status === "active").length ?? 0;

    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (!employees) {
      return [];
    }

    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return employees;
    }

    return employees.filter((employee) => {
      const name = employee.full_name?.toLowerCase() ?? "";

      const phone = employee.phone?.toLowerCase() ?? "";

      const role = employee.roles?.name?.toLowerCase() ?? "";

      return (
        name.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        role.includes(searchTerm)
      );
    });
  }, [employees, search]);

  const gridClass =
    view === "large"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

  return (
    <div className="space-y-5">
      {/* STATISTICS */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* TOTAL */}
        <div className="rounded-xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <HiOutlineUserGroup className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Total staff</p>

              <p className="text-lg leading-tight font-semibold text-gray-950">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="rounded-xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <HiOutlineUserCircle className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Active</p>

              <p className="text-lg leading-tight font-semibold text-gray-950">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        {/* INACTIVE */}
        <div className="rounded-xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <HiOutlineUserMinus className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Inactive</p>

              <p className="text-lg leading-tight font-semibold text-gray-950">
                {stats.inactive}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EMPLOYEE SECTION */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        {/* TOOLBAR */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-gray-950">
              Employees
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? `${filteredEmployees.length} results found`
                : `${stats.total} employees in your restaurant`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* SEARCH */}
            <div className="relative w-full sm:w-64">
              <HiOutlineMagnifyingGlass className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employees..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-950/5"
              />
            </div>

            {/* VIEW SWITCHER */}
            <ViewSwitcher value={view} onChange={onViewChange} />
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredEmployees.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <HiOutlineMagnifyingGlass className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-950">
              No employees found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              {search
                ? `No employees match "${search}". Try another search.`
                : "There are currently no employees to display."}
            </p>
          </div>
        ) : (
          <>
            {/* LIST VIEW */}
            {view === "list" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
                        Employee
                      </th>

                      <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
                        Phone
                      </th>

                      <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
                        Role
                      </th>

                      <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
                        Status
                      </th>

                      <th className="w-12 px-6 py-4">
                        <span className="sr-only">Open employee</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((employee) => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        view="list"
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* COMPACT / LARGE VIEW */}
            {view !== "list" && (
              <div className="p-5">
                <div className={gridClass}>
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      view={view}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* FOOTER */}
        {filteredEmployees.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-600">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-600">{stats.total}</span>{" "}
              employees
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeList;
