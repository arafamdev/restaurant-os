import { NavLink } from "react-router-dom";
import { HiOutlineMapPin, HiOutlineUsers } from "react-icons/hi2";

import TableCard from "./TableCard";

function TableList({ tables, view = "compact", canManage = false, onEdit }) {
  if (!tables?.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-[#374151] dark:bg-[#111827]">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          No tables found
        </p>

        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          {canManage
            ? "Create a table to start managing your restaurant floor."
            : "There are no tables available to display."}
        </p>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#374151] dark:bg-[#111827]">
        <div className="hidden grid-cols-[80px_1fr_140px_140px_180px] items-center gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase md:grid dark:border-[#374151] dark:bg-[#0B1120] dark:text-gray-400">
          <span>Table</span>
          <span>Details</span>
          <span>Capacity</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#374151]">
          {tables.map((table) => (
            <TableCardList
              key={table.id}
              table={table}
              canManage={canManage}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
    );
  }

  const gridClass =
    view === "large"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

  return (
    <div className={gridClass}>
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          view={view}
          canManage={canManage}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function TableCardList({ table, canManage = false, onEdit }) {
  const statusStyles = {
    available:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
    occupied:
      "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
    maintenance:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  };

  const currentStatus = statusStyles[table.status] || statusStyles.available;

  const actionLinkClasses =
    "rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#374151] dark:text-gray-300 dark:hover:bg-gray-800";

  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-gray-50/70 md:grid-cols-[80px_1fr_140px_140px_180px] md:items-center md:gap-4 dark:hover:bg-gray-800/30">
      <div>
        <NavLink
          to={`/tables/${table.id}`}
          className="font-semibold text-gray-950 transition-colors hover:text-emerald-600 dark:text-[#F9FAFB] dark:hover:text-emerald-400"
        >
          Table {String(table.table_number).padStart(2, "0")}
        </NavLink>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <HiOutlineMapPin className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
        <span className="capitalize">{table.location}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <HiOutlineUsers className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
        <span>
          {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
        </span>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${currentStatus}`}
        >
          {table.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 md:justify-end">
        <NavLink to={`/tables/${table.id}`} className={actionLinkClasses}>
          View
        </NavLink>

        {canManage && (
          <button
            type="button"
            onClick={() => onEdit?.(table)}
            className={actionLinkClasses}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default TableList;
