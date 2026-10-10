
import { useMemo, useState } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineUserMinus,
  HiOutlineXMark,
} from "react-icons/hi2";

import EmployeeCard from "./EmployeeCard";
import ViewSwitcher from "../../../ui/ViewSwitcher";


function EmployeeList({ employees = [], view, onViewChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = useMemo(() => {
    const active = employees.filter(
      (employee) => employee.status === "active",
    ).length;

    return {
      total: employees.length,
      active,
      inactive: employees.length - active,
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return employees;

    return employees.filter((employee) => {
      const name = employee.full_name?.toLowerCase() ?? "";
      const phone = employee.phone?.toLowerCase() ?? "";
      const role = employee.roles?.name?.toLowerCase() ?? "";

      return (
        name.includes(search) ||
        phone.includes(search) ||
        role.includes(search)
      );
    });
  }, [employees, searchTerm]);

  const isListView = view === "list";

  const statCards = [
    {
      label: "Total employees",
      value: stats.total,
      icon: HiOutlineUserGroup,
      iconClass:
        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
      valueClass: "text-gray-900 dark:text-gray-100",
    },
    {
      label: "Active employees",
      value: stats.active,
      icon: HiOutlineUserCircle,
      iconClass:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
      valueClass: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Inactive employees",
      value: stats.inactive,
      icon: HiOutlineUserMinus,
      iconClass:
        "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
      valueClass: "text-amber-700 dark:text-amber-400",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="
                group relative overflow-hidden rounded-2xl border
                border-gray-200/80 bg-white p-5
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:border-emerald-300
                hover:shadow-lg hover:shadow-gray-200/50
                dark:border-gray-800 dark:bg-[#111827]
                dark:hover:border-emerald-500/40
                dark:hover:shadow-black/20
                motion-reduce:transform-none motion-reduce:transition-none
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>

                  <p
                    className={`mt-3 text-3xl font-semibold tracking-tight ${stat.valueClass}`}
                  >
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-xl transition-transform duration-300
                    group-hover:scale-110
                    motion-reduce:transform-none
                    ${stat.iconClass}
                  `}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div
                className="
                  absolute inset-x-0 bottom-0 h-0.5 origin-left
                  scale-x-0 bg-emerald-500 transition-transform
                  duration-300 group-hover:scale-x-100
                  motion-reduce:transition-none
                "
              />
            </article>
          );
        })}
      </div>

      {/* Employee directory */}
      <div
        className="
          overflow-hidden rounded-2xl border border-gray-200/80
          bg-white shadow-sm
          dark:border-gray-800 dark:bg-[#111827]
        "
      >
        {/* Heading */}
        <div
          className="
            flex flex-col gap-4 border-b border-gray-200/80
            px-5 py-5 sm:px-6
            dark:border-gray-800
            md:flex-row md:items-center md:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="
                  flex h-9 w-9 items-center justify-center rounded-xl
                  bg-emerald-50 text-emerald-700
                  dark:bg-emerald-500/10 dark:text-emerald-400
                "
              >
                <HiOutlineUserGroup className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                Employee directory
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage your team and employee information.
            </p>
          </div>

          <span
            className="
              inline-flex w-fit items-center rounded-full
              border border-gray-200 bg-gray-50 px-3 py-1.5
              text-xs font-medium text-gray-600
              dark:border-gray-700 dark:bg-gray-800/70
              dark:text-gray-300
            "
          >
            {filteredEmployees.length}{" "}
            {filteredEmployees.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* Search and view controls */}
        <div
          className="
            flex flex-col gap-3 border-b border-gray-200/80
            px-5 py-4 sm:px-6
            dark:border-gray-800
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <div className="relative w-full sm:max-w-md">
            <HiOutlineMagnifyingGlass
              className="
                pointer-events-none absolute left-3.5 top-1/2
                h-5 w-5 -translate-y-1/2 text-gray-400
                transition-colors duration-200
                peer-focus:text-emerald-600
                dark:text-gray-500 dark:peer-focus:text-emerald-400
              "
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, phone or role..."
              aria-label="Search employees by name, phone or role"
              className="
                peer w-full rounded-xl border border-gray-200
                bg-gray-50/70 py-2.5 pl-11 pr-10 text-sm
                text-gray-900 outline-none
                placeholder:text-gray-400
                transition-all duration-200
                hover:border-gray-300 hover:bg-white
                focus:border-emerald-500 focus:bg-white
                focus:ring-4 focus:ring-emerald-500/10
                dark:border-gray-700 dark:bg-gray-900/60
                dark:text-gray-100 dark:placeholder:text-gray-500
                dark:hover:border-gray-600 dark:hover:bg-gray-900
                dark:focus:border-emerald-500
                dark:focus:bg-gray-900
                dark:focus:ring-emerald-500/10
              "
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="
                  absolute right-3 top-1/2 flex h-7 w-7
                  -translate-y-1/2 items-center justify-center
                  rounded-lg text-gray-400
                  transition-colors duration-200
                  hover:bg-gray-200 hover:text-gray-700
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-emerald-500
                  dark:hover:bg-gray-800 dark:hover:text-gray-200
                "
              >
                <HiOutlineXMark className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              View
            </span>

            <ViewSwitcher value={view} onChange={onViewChange} />
          </div>
        </div>

        {/* Employee content */}
        <div className="p-4 sm:p-6">
          {filteredEmployees.length === 0 ? (
            <div
              className="
                flex min-h-64 flex-col items-center justify-center
                rounded-xl border border-dashed border-gray-300
                bg-gray-50/50 px-5 py-12 text-center
                dark:border-gray-700 dark:bg-gray-900/30
              "
            >
              <div
                className="
                  flex h-14 w-14 items-center justify-center rounded-2xl
                  bg-gray-100 text-gray-500
                  dark:bg-gray-800 dark:text-gray-400
                "
              >
                <HiOutlineMagnifyingGlass className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {searchTerm
                  ? "No employees found"
                  : "No employees yet"}
              </h3>

              <p className="mt-1.5 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try another name, phone number or role."
                  : "Employees will appear here when they are added to your team."}
              </p>

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="
                    mt-4 rounded-lg px-3 py-2 text-sm font-medium
                    text-emerald-700 transition-colors duration-200
                    hover:bg-emerald-50
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-emerald-500
                    dark:text-emerald-400 dark:hover:bg-emerald-500/10
                  "
                >
                  Clear search
                </button>
              )}
            </div>
          ) : isListView ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    {["Employee", "Phone", "Role", "Status", ""].map(
                      (heading, index) => (
                        <th
                          key={`${heading}-${index}`}
                          scope="col"
                          className="
                            whitespace-nowrap px-4 py-3 text-xs
                            font-semibold uppercase tracking-wider
                            text-gray-500 dark:text-gray-400
                          "
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
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
          ) : (
            <div
              className={`
                grid grid-cols-1 gap-4
                ${
                  view === "large"
                    ? "sm:grid-cols-2 xl:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                }
              `}
            >
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="
                    min-w-0 rounded-2xl
                    transition-all duration-200 ease-out
                    hover:-translate-y-0.5
                    motion-reduce:transform-none motion-reduce:transition-none
                  "
                >
                  <EmployeeCard employee={employee} view={view} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredEmployees.length > 0 && (
          <div
            className="
              flex flex-col gap-1 border-t border-gray-200/80
              bg-gray-50/60 px-5 py-3.5
              dark:border-gray-800 dark:bg-gray-900/30
              sm:flex-row sm:items-center sm:justify-between sm:px-6
            "
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {employees.length}
              </span>{" "}
              employees
            </p>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              RestaurantOS · Team management
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default EmployeeList;