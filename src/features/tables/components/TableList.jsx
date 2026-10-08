import { NavLink } from "react-router-dom";

import { HiOutlineMapPin, HiOutlineUsers } from "react-icons/hi2";

import TableCard from "./TableCard";

function TableList({ tables, view = "compact", canManage = false }) {
  if (!tables?.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-gray-700">No tables found</p>

        <p className="mt-1 text-sm text-gray-400">
          {canManage
            ? "Create a table to start managing your restaurant floor."
            : "There are no tables available to display."}
        </p>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="hidden grid-cols-[80px_1fr_140px_140px_180px] items-center gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase md:grid">
          <span>Table</span>
          <span>Details</span>
          <span>Capacity</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {tables.map((table) => (
            <TableCardList key={table.id} table={table} canManage={canManage} />
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
        />
      ))}
    </div>
  );
}

function TableCardList({ table, canManage = false }) {
  const statusStyles = {
    available: "bg-emerald-50 text-emerald-700",
    occupied: "bg-blue-50 text-blue-700",
    maintenance: "bg-amber-50 text-amber-700",
  };

  const currentStatus = statusStyles[table.status] || statusStyles.available;

  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[80px_1fr_140px_140px_180px] md:items-center md:gap-4">
      {/* Table */}
      <div>
        <NavLink
          to={`/tables/${table.id}`}
          className="font-semibold text-gray-950 transition-colors hover:text-emerald-600"
        >
          Table {String(table.table_number).padStart(2, "0")}
        </NavLink>
      </div>

      {/* Details */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <HiOutlineMapPin className="h-4 w-4 text-gray-400" />

        <span className="capitalize">{table.location}</span>
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <HiOutlineUsers className="h-4 w-4 text-gray-400" />

        <span>
          {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
        </span>
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${currentStatus}`}
        >
          {table.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 md:justify-end">
        <NavLink
          to={`/tables/${table.id}`}
          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          View
        </NavLink>

        {canManage && (
          <NavLink
            to={`/tables/${table.id}/edit`}
            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Edit
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default TableList;
