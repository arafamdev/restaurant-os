import { useNavigate } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlinePhone,
} from "react-icons/hi2";

function formatRole(roleName) {
  if (!roleName) {
    return "Unknown";
  }

  return roleName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function EmployeeCard({ employee, view = "compact" }) {
  const navigate = useNavigate();

  const isActive = employee.status === "active";

  const initials = getInitials(employee.full_name);

  const roleLabel = formatRole(employee.roles?.name);

  function handleClick() {
    navigate(`/staff/${employee.id}`);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/staff/${employee.id}`);
    }
  }

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-gray-400"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  );

  /* -------------------------------------------------
     LIST VIEW
  ------------------------------------------------- */

  if (view === "list") {
    return (
      <tr
        tabIndex={0}
        role="link"
        aria-label={`Open ${employee.full_name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group cursor-pointer transition-colors outline-none hover:bg-gray-50/80 focus-visible:bg-gray-50/80"
      >
        {/* EMPLOYEE */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-950">
                {employee.full_name}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Employee #{employee.id}
              </p>
            </div>
          </div>
        </td>

        {/* PHONE */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-gray-600">
            <HiOutlinePhone className="h-4 w-4 shrink-0 text-gray-400" />

            <span>{employee.phone || "—"}</span>
          </div>
        </td>

        {/* ROLE */}
        <td className="px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2.5 py-1.5">
            <HiOutlineBriefcase className="h-4 w-4 text-gray-500" />

            <span className="text-xs font-semibold text-gray-700">
              {roleLabel}
            </span>
          </div>
        </td>

        {/* STATUS */}
        <td className="px-6 py-4">{statusBadge}</td>

        {/* ACTION */}
        <td className="px-6 py-4 text-right">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-300 transition-all duration-200 group-hover:bg-gray-950 group-hover:text-white group-focus-visible:bg-gray-950 group-focus-visible:text-white">
            <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </td>
      </tr>
    );
  }

  /* -------------------------------------------------
     COMPACT VIEW
  ------------------------------------------------- */

  if (view === "compact") {
    return (
      <article
        tabIndex={0}
        role="link"
        aria-label={`Open ${employee.full_name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-950/10"
      >
        <div className="flex items-start gap-3">
          {/* AVATAR */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            {initials}
          </div>

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-950">
                  {employee.full_name}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  Employee #{employee.id}
                </p>
              </div>

              {statusBadge}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
              <HiOutlineBriefcase className="h-4 w-4 text-gray-400" />

              <span className="truncate">{roleLabel}</span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
              <HiOutlinePhone className="h-4 w-4 text-gray-400" />

              <span className="truncate">{employee.phone || "No phone"}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* -------------------------------------------------
     LARGE VIEW
  ------------------------------------------------- */

  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={`Open ${employee.full_name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-950/10"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        {statusBadge}

        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition-all duration-200 group-hover:bg-gray-950 group-hover:text-white">
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* AVATAR */}
      <div className="mt-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-950 text-xl font-semibold tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
          {initials}
        </div>
      </div>

      {/* IDENTITY */}
      <div className="mt-5 text-center">
        <h3 className="truncate text-base font-semibold tracking-tight text-gray-950">
          {employee.full_name}
        </h3>

        <p className="mt-1 text-xs text-gray-400">Employee #{employee.id}</p>
      </div>

      {/* DETAILS */}
      <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlineBriefcase className="h-4 w-4 shrink-0 text-gray-400" />

          <span className="truncate">{roleLabel}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlinePhone className="h-4 w-4 shrink-0 text-gray-400" />

          <span className="truncate">{employee.phone || "No phone"}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-xs text-gray-400">View employee</span>

        <HiOutlineArrowRight className="h-4 w-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-700" />
      </div>
    </article>
  );
}

export default EmployeeCard;
