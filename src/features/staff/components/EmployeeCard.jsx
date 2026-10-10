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

function Avatar({ initials, sizeClass = "h-11 w-11", textClass = "text-sm" }) {
  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 ${textClass} font-semibold tracking-tight text-gray-800 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
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
      handleClick();
    }
  }

  const statusBadge = (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-500"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  const listClassName =
    "group cursor-pointer outline-none transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/40 dark:hover:bg-gray-800/60 dark:focus-visible:bg-gray-800/60";

  const cardClassName =
    "group card-hover cursor-pointer p-4 focus-visible:ring-2";

  if (view === "list") {
    return (
      <tr
        tabIndex={0}
        role="link"
        aria-label={`Open ${employee.full_name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={listClassName}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar initials={initials} />

            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-950 dark:text-gray-100">
                {employee.full_name}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Employee #{employee.id}
              </p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiOutlinePhone className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
            <span>{employee.phone || "—"}</span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2.5 py-1.5 dark:bg-gray-900">
            <HiOutlineBriefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />

            <span className="text-xs font-semibold text-gray-700 dark:text-gray-100">
              {roleLabel}
            </span>
          </div>
        </td>

        <td className="px-6 py-4">{statusBadge}</td>

        <td className="px-6 py-4 text-right">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors group-hover:bg-gray-900 group-hover:text-white group-focus-visible:bg-gray-900 group-focus-visible:text-white dark:text-gray-400 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-100 dark:group-focus-visible:bg-gray-700 dark:group-focus-visible:text-gray-100">
            <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </div>
        </td>
      </tr>
    );
  }

  if (view === "compact") {
    return (
      <article
        tabIndex={0}
        role="link"
        aria-label={`Open ${employee.full_name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cardClassName}
      >
        <div className="flex items-start gap-3">
          <Avatar initials={initials} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-950 dark:text-gray-100">
                  {employee.full_name}
                </p>

                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                  Employee #{employee.id}
                </p>
              </div>

              {statusBadge}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <HiOutlineBriefcase className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{roleLabel}</span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <HiOutlinePhone className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{employee.phone || "No phone"}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={`Open ${employee.full_name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${cardClassName} p-5`}
    >
      <div className="flex items-start justify-between gap-4">
        {statusBadge}

        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors group-hover:bg-gray-900 group-hover:text-white dark:text-gray-400 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-100">
          <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Avatar
          initials={initials}
          sizeClass="h-20 w-20 rounded-2xl"
          textClass="text-xl"
        />
      </div>

      <div className="mt-5 text-center">
        <h3 className="truncate text-base font-semibold tracking-tight text-gray-950 dark:text-gray-100">
          {employee.full_name}
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Employee #{employee.id}
        </p>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <HiOutlineBriefcase className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
          <span className="truncate">{roleLabel}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <HiOutlinePhone className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
          <span className="truncate">{employee.phone || "No phone"}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          View employee
        </span>

        <HiOutlineArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-700 motion-reduce:transition-none dark:text-gray-400 dark:group-hover:text-gray-100" />
      </div>
    </article>
  );
}

export default EmployeeCard;
