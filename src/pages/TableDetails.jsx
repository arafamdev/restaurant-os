import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineSquares2X2,
} from "react-icons/hi2";

import { useTable } from "../features/tables/hooks/useTable";
import { useDeleteTable } from "../features/tables/hooks/useDeleteTable";
import TableVisual from "../features/tables/components/TableVisual";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import BackButton from "../ui/BackButton";
import Button from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";

function TableDetails() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { table, isLoading, error } = useTable(tableId);
  const { deleteTable, isDeleting } = useDeleteTable();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!table) {
    return <ErrorMessage message="Table not found." />;
  }

  const statusStyles = {
    available: {
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    occupied: {
      badge:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    maintenance: {
      badge:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
      dot: "bg-amber-500",
    },
  };

  const currentStatus = statusStyles[table.status] || statusStyles.available;

  function handleDelete() {
    deleteTable(table.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate("/tables");
      },
    });
  }

  return (
    <>
      <div className="min-h-full space-y-6 bg-gray-50/70 p-4 sm:p-6 dark:bg-[#0B1120]">
        {/* Back navigation */}
        <BackButton to="/tables" label="Back to Tables" />

        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm dark:border-gray-700 dark:bg-[#1F2937] dark:text-gray-200">
                <HiOutlineSquares2X2 size={23} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
                Table {String(table.table_number).padStart(2, "0")}
              </h1>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${currentStatus.badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
                />
                {table.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage table information and activity.
            </p>
          </div>

          <Button
            variation="secondary"
            onClick={() => navigate(`/tables/${table.id}/edit`)}
          >
            Edit table
          </Button>
        </header>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          {/* Table visual */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700/80 dark:bg-[#111827]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Table overview
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Visual representation of this table.
              </p>
            </div>

            <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700/60 dark:bg-[#0B1120]">
              <TableVisual
                tableNumber={table.table_number}
                capacity={table.capacity}
                status={table.status}
                size="large"
              />
            </div>
          </section>

          {/* Right column */}
          <div className="space-y-6">
            {/* Table information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700/80 dark:bg-[#111827]">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Table information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Basic information about this table.
                </p>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {/* Capacity */}
                <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <HiOutlineUsers size={20} />
                    </div>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Capacity
                    </span>
                  </div>

                  <span className="text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <HiOutlineMapPin size={20} />
                    </div>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Location
                    </span>
                  </div>

                  <span className="text-right text-sm font-semibold text-gray-900 capitalize dark:text-gray-100">
                    {table.location || "Not specified"}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${currentStatus.badge}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
                    />
                    {table.status}
                  </span>
                </div>
              </div>
            </section>

            {/* Current session */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700/80 dark:bg-[#111827]">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Current session
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Active activity for this table.
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center dark:border-gray-700 dark:bg-[#0B1120]">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <HiOutlineSquares2X2 size={21} />
                </div>

                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  No active session
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Active orders and sessions will appear here.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Danger zone */}
        <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-6 dark:border-red-500/20 dark:bg-[#111827]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">
                Delete table
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
                Permanently remove this table from the restaurant.
              </p>
            </div>

            <Button
              variation="danger"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting}
            >
              Delete table
            </Button>
          </div>
        </section>
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete table?"
        description={`Are you sure you want to delete Table ${table.table_number}? This action cannot be undone.`}
        confirmText="Delete table"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </>
  );
}

export default TableDetails;
