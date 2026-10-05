import { NavLink } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineSquares2X2,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

import { useTables } from "../features/tables/hooks/useTables";

import TableList from "../features/tables/components/TableList";

import ViewSwitcher from "../ui/ViewSwitcher";
import useViewMode from "../hooks/useViewMode";

import Spinner from "../ui/Spinner";
import Button from "../ui/Button";

function Tables() {
  const { tables, isLoading, error } = useTables();

  const [view, setView] = useViewMode("tables");

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error.message}</p>;
  }

  const tableList = tables ?? [];

  const totalTables = tableList.length;

  const availableTables = tableList.filter(
    (table) => table.status === "available",
  ).length;

  const occupiedTables = tableList.filter(
    (table) => table.status === "occupied",
  ).length;

  const maintenanceTables = tableList.filter(
    (table) => table.status === "maintenance",
  ).length;

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
            Tables
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant tables and their current status.
          </p>
        </div>

        <NavLink to="/tables/new">
          <Button>Create new table</Button>
        </NavLink>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* TOTAL */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
              <HiOutlineSquares2X2 className="h-5 w-5 text-gray-500" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Total tables</p>

              <p className="mt-0.5 text-xl font-semibold text-gray-950">
                {totalTables}
              </p>
            </div>
          </div>
        </div>

        {/* AVAILABLE */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <HiOutlineCheckCircle className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Available</p>

              <p className="mt-0.5 text-xl font-semibold text-gray-950">
                {availableTables}
              </p>
            </div>
          </div>
        </div>

        {/* OCCUPIED */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <HiOutlineSquares2X2 className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Occupied</p>

              <p className="mt-0.5 text-xl font-semibold text-gray-950">
                {occupiedTables}
              </p>
            </div>
          </div>
        </div>

        {/* MAINTENANCE */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <HiOutlineWrenchScrewdriver className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Maintenance</p>

              <p className="mt-0.5 text-xl font-semibold text-gray-950">
                {maintenanceTables}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE VIEW CONTROLS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-950">
            Restaurant tables
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose how you want to view your tables.
          </p>
        </div>

        <ViewSwitcher value={view} onChange={setView} />
      </div>

      {/* TABLES */}
      <TableList tables={tableList} view={view} />
    </div>
  );
}

export default Tables;
