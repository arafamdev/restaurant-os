import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineSquares2X2,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

import { useTables } from "../features/tables/hooks/useTables";
import { useHasPermission } from "../features/auth/hooks/useHasPermission";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";
import { useRestaurantContext } from "../context/useRestaurantContext";

import TableList from "../features/tables/components/TableList";
import ViewSwitcher from "../ui/ViewSwitcher";
import useViewMode from "../hooks/useViewMode";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";

function Tables() {
  const { tables, isLoading, error } = useTables();

  const [view, setView] = useViewMode("tables");

  const {
    userContext,
    isLoading: isUserContextLoading,
    error: userContextError,
  } = useCurrentUserContext();

  const {
    isAllRestaurants,
    isLoading: isRestaurantContextLoading,
    error: restaurantContextError,
  } = useRestaurantContext();

  const {
    hasPermission,
    isLoading: isPermissionLoading,
    error: permissionError,
  } = useHasPermission("manage_tables");

  const isPlatformAdmin = Boolean(userContext?.is_platform_admin);

  const canManageTables = isPlatformAdmin || hasPermission;

  const isLoadingPage =
    isLoading ||
    isPermissionLoading ||
    isUserContextLoading ||
    isRestaurantContextLoading;

  const pageError =
    error || permissionError || userContextError || restaurantContextError;

  const tableList = useMemo(() => tables ?? [], [tables]);

  const restaurantGroups = useMemo(() => {
    if (!isPlatformAdmin || !isAllRestaurants) {
      return [];
    }

    const groups = new Map();

    tableList.forEach((table) => {
      const currentRestaurantId = table.restaurant_id;

      if (!currentRestaurantId) {
        return;
      }

      if (!groups.has(currentRestaurantId)) {
        groups.set(currentRestaurantId, {
          id: currentRestaurantId,
          name: table.restaurants?.name ?? `Restaurant ${currentRestaurantId}`,
          tables: [],
        });
      }

      groups.get(currentRestaurantId).tables.push(table);
    });

    return Array.from(groups.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [tableList, isPlatformAdmin, isAllRestaurants]);

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

  if (isLoadingPage) {
    return <Spinner />;
  }

  if (pageError) {
    return <p className="text-sm text-red-600">{pageError.message}</p>;
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
            Tables
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isPlatformAdmin
              ? isAllRestaurants
                ? "View and manage tables across your restaurants."
                : "View and manage tables for the selected restaurant."
              : canManageTables
                ? "Manage your restaurant tables and their current status."
                : "View your restaurant tables and their current status."}
          </p>
        </div>

        {canManageTables && (
          <NavLink to="/tables/new">
            <Button>Create new table</Button>
          </NavLink>
        )}
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
      {isPlatformAdmin && isAllRestaurants ? (
        <div className="space-y-8">
          {restaurantGroups.map((restaurant) => (
            <section key={restaurant.id}>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-950">
                  {restaurant.name}
                </h3>

                <p className="mt-0.5 text-xs text-gray-400">
                  {restaurant.tables.length}{" "}
                  {restaurant.tables.length === 1 ? "table" : "tables"}
                </p>
              </div>

              <TableList
                tables={restaurant.tables}
                view={view}
                canManage={canManageTables}
              />
            </section>
          ))}

          {restaurantGroups.length === 0 && (
            <TableList tables={[]} view={view} canManage={canManageTables} />
          )}
        </div>
      ) : (
        <TableList tables={tableList} view={view} canManage={canManageTables} />
      )}
    </div>
  );
}

export default Tables;
