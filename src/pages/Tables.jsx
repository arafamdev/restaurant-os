import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  HiOutlineCheckCircle,
  HiOutlineSquares2X2,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

import { useTables } from "../features/tables/hooks/useTables";
import { useHasPermission } from "../features/auth/hooks/useHasPermission";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";

import TableList from "../features/tables/components/TableList";

import ViewSwitcher from "../ui/ViewSwitcher";

import useViewMode from "../hooks/useViewMode";

import Spinner from "../ui/Spinner";
import Button from "../ui/Button";

function Tables() {
  const { tables, isLoading, error } = useTables();

  const [view, setView] = useViewMode("tables");

  const [selectedRestaurant, setSelectedRestaurant] = useState("all");

  const {
    userContext,
    isLoading: isUserContextLoading,
    error: userContextError,
  } = useCurrentUserContext();

  const {
    hasPermission,
    isLoading: isPermissionLoading,
    error: permissionError,
  } = useHasPermission("manage_tables");

  const isPlatformAdmin = Boolean(userContext?.is_platform_admin);

  const canManageTables = isPlatformAdmin || hasPermission;

  const isLoadingPage =
    isLoading || isPermissionLoading || isUserContextLoading;

  const pageError = error || permissionError || userContextError;

  const tableList = tables ?? [];

  const restaurants = useMemo(() => {
    const uniqueRestaurants = new Map();

    tableList.forEach((table) => {
      if (!table.restaurant_id || !table.restaurants) return;

      uniqueRestaurants.set(table.restaurant_id, {
        id: table.restaurant_id,
        name: table.restaurants.name,
      });
    });

    return Array.from(uniqueRestaurants.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [tableList]);

  const filteredTables = useMemo(() => {
    if (!isPlatformAdmin || selectedRestaurant === "all") {
      return tableList;
    }

    return tableList.filter(
      (table) => String(table.restaurant_id) === selectedRestaurant,
    );
  }, [tableList, selectedRestaurant, isPlatformAdmin]);

  const restaurantGroups = useMemo(() => {
    if (!isPlatformAdmin || selectedRestaurant !== "all") {
      return [];
    }

    const groups = new Map();

    tableList.forEach((table) => {
      const restaurantId = table.restaurant_id;

      if (!groups.has(restaurantId)) {
        groups.set(restaurantId, {
          id: restaurantId,
          name: table.restaurants?.name ?? `Restaurant ${restaurantId}`,
          tables: [],
        });
      }

      groups.get(restaurantId).tables.push(table);
    });

    return Array.from(groups.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [tableList, isPlatformAdmin, selectedRestaurant]);

  const totalTables = filteredTables.length;

  const availableTables = filteredTables.filter(
    (table) => table.status === "available",
  ).length;

  const occupiedTables = filteredTables.filter(
    (table) => table.status === "occupied",
  ).length;

  const maintenanceTables = filteredTables.filter(
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
              ? "View and manage tables across your restaurants."
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

      {/* PLATFORM ADMIN RESTAURANT FILTER */}
      {isPlatformAdmin && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-950">Restaurant</p>

              <p className="mt-0.5 text-xs text-gray-500">
                Filter tables by restaurant.
              </p>
            </div>

            <select
              value={selectedRestaurant}
              onChange={(event) => setSelectedRestaurant(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition outline-none focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            >
              <option value="all">All restaurants</option>

              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

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
      {isPlatformAdmin && selectedRestaurant === "all" ? (
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
        <TableList
          tables={filteredTables}
          view={view}
          canManage={canManageTables}
        />
      )}
    </div>
  );
}

export default Tables;
