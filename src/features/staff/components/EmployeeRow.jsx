import { useNavigate } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlinePhone,
} from "react-icons/hi2";

function formatRole(roleName) {
  if (!roleName) return "Unknown";

  return roleName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function EmployeeRow({ employee }) {
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

  return (
    <tr
      tabIndex={0}
      role="link"
      aria-label={`Open ${employee.full_name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer transition-colors outline-none hover:bg-gray-50/80 focus-visible:bg-gray-50/80"
    >
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

      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-gray-600">
          <HiOutlinePhone className="h-4 w-4 shrink-0 text-gray-400" />

          <span>{employee.phone || "—"}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2.5 py-1.5">
          <HiOutlineBriefcase className="h-4 w-4 text-gray-500" />

          <span className="text-xs font-semibold text-gray-700">
            {roleLabel}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          } `}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? "bg-emerald-500" : "bg-gray-400"
            } `}
          />

          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-300 transition-all duration-200 group-hover:bg-gray-950 group-hover:text-white group-focus-visible:bg-gray-950 group-focus-visible:text-white">
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </td>
    </tr>
  );
}

export default EmployeeRow;
