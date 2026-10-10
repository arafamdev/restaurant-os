import { useMemo, useState } from "react";

import {
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineSquares2X2,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

import { useTables } from "../features/tables/hooks/useTables";
import { useHasPermission } from "../features/auth/hooks/useHasPermission";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";
import { useRestaurantContext } from "../context/useRestaurantContext";

import TableList from "../features/tables/components/TableList";
import TableForm from "../features/tables/components/TableForm";

import PageHeader from "../ui/PageHeader";
import ViewSwitcher from "../ui/ViewSwitcher";
import useViewMode from "../hooks/useViewMode";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

function Tables() {
  const [view, setView] = useViewMode("tables");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);

  const { tables, isLoading, error } = useTables();

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

  // Agrupar mesas por restaurante para o Platform Admin.
  const restaurantGroups = useMemo(() => {
    if (!isPlatformAdmin || !isAllRestaurants) {
      return [];
    }

    const groups = new Map();

    tableList.forEach((table) => {
      const currentRestaurantId = table.restaurant_id;

      if (!currentRestaurantId) return;

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

  // Estatísticas das mesas.
  const totalTables = tableList.length;

  const availableTables = tableList.filter(
    (table) => table.status === "available",
  ).length;

  const occupiedTables = tableList.filter(
    (table) => table.status === "occupied",
  ).length;

  const maintenanceTables = tableList.filter(
    (table) => table.status === "maintenance" || table.status === "unavailable",
  ).length;

  function handleOpenCreateModal() {
    setTableToEdit(null);
    setIsTableModalOpen(true);
  }

  function handleOpenEditModal(table) {
    if (!canManageTables) return;

    setTableToEdit(table);
    setIsTableModalOpen(true);
  }

  function handleCloseTableModal() {
    setIsTableModalOpen(false);
    setTableToEdit(null);
  }

  if (isLoadingPage) {
    return <Spinner />;
  }

  if (pageError) {
    return <ErrorMessage message={pageError.message} />;
  }

  const stats = [
    {
      label: "Total tables",
      value: totalTables,
      icon: HiOutlineSquares2X2,
      iconColor: "text-gray-600 dark:text-gray-300",
      iconBg: "bg-gray-100 dark:bg-gray-700/60",
    },
    {
      label: "Available",
      value: availableTables,
      icon: HiOutlineCheckCircle,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Occupied",
      value: occupiedTables,
      icon: HiOutlineSquares2X2,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Maintenance",
      value: maintenanceTables,
      icon: HiOutlineWrenchScrewdriver,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-full space-y-6 bg-gray-50/70 p-4 sm:p-6 dark:bg-[#0B1120]">
      {/* Header */}

      <PageHeader
        icon={HiOutlineSquares2X2}
        title="Tables"
        description={
          isPlatformAdmin
            ? isAllRestaurants
              ? "View and manage tables across your restaurants."
              : "View and manage tables for the selected restaurant."
            : canManageTables
              ? "Manage your restaurant tables and their current status."
              : "View your restaurant tables and their current status."
        }
        action={
          canManageTables ? (
            <Button onClick={handleOpenCreateModal}>
              <span className="flex items-center gap-2">
                <HiOutlinePlus className="h-5 w-5" />
                Create new table
              </span>
            </Button>
          ) : null
        }
      />

      {/* Indicadores com hover */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-gray-200/50 motion-reduce:transform-none motion-reduce:transition-none sm:p-5 dark:border-gray-800 dark:bg-[#111827] dark:hover:border-emerald-500/40 dark:hover:shadow-black/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none ${stat.iconBg} `}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900 tabular-nums sm:text-2xl dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </div>

              {/* Linha de destaque no hover */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-emerald-500 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
            </article>
          );
        })}
      </section>

      {/* Controlos de visualização */}
      <section className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-gray-800 dark:bg-[#111827]">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Restaurant tables
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose how you want to view your tables.
          </p>
        </div>

        <div className="transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none">
          <ViewSwitcher value={view} onChange={setView} />
        </div>
      </section>

      {/* Lista de mesas */}
      {isPlatformAdmin && isAllRestaurants ? (
        <div className="space-y-8">
          {restaurantGroups.map((restaurant) => (
            <section key={restaurant.id} className="space-y-4">
              <div className="border-l-2 border-emerald-500 pl-4 transition-colors duration-200">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {restaurant.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {restaurant.tables.length}{" "}
                  {restaurant.tables.length === 1 ? "table" : "tables"}
                </p>
              </div>

              <TableList
                tables={restaurant.tables}
                view={view}
                canManage={canManageTables}
                onEdit={handleOpenEditModal}
              />
            </section>
          ))}

          {restaurantGroups.length === 0 && (
            <TableList
              tables={[]}
              view={view}
              canManage={canManageTables}
              onEdit={handleOpenEditModal}
            />
          )}
        </div>
      ) : (
        <TableList
          tables={tableList}
          view={view}
          canManage={canManageTables}
          onEdit={handleOpenEditModal}
        />
      )}

      {/* Modal partilhado de criação e edição */}
      {isTableModalOpen && (
        <Modal onClose={handleCloseTableModal} size="large">
          <TableForm
            key={tableToEdit?.id ?? "new-table"}
            tableToEdit={tableToEdit ?? {}}
            userContext={userContext}
            onSuccess={handleCloseTableModal}
            onCancel={handleCloseTableModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default Tables;
