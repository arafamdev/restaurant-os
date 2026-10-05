import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineMapPin, HiOutlineUsers } from "react-icons/hi2";

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

  const statusStyles = {
    available: {
      badge: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
    occupied: {
      badge: "bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
    },
    maintenance: {
      badge: "bg-amber-50 text-amber-700",
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
      <div className="space-y-6">
        {/* Back */}
        <BackButton to="/tables" label="Back to Tables" />

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
                Table {String(table.table_number).padStart(2, "0")}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${currentStatus.badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
                />

                {table.status}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-gray-500">
              Manage table information and activity.
            </p>
          </div>

          <Button
            variation="secondary"
            onClick={() => navigate(`/tables/${table.id}/edit`)}
          >
            Edit table
          </Button>
        </div>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          {/* Visual */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-950">
                Table overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Visual representation of this table.
              </p>
            </div>

            <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-gray-50">
              <TableVisual
                tableNumber={table.table_number}
                capacity={table.capacity}
                status={table.status}
                size="large"
              />
            </div>
          </section>

          {/* Right */}
          <div className="space-y-6">
            {/* Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-950">
                  Table information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Basic information about this table.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {/* Capacity */}
                <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                      <HiOutlineUsers className="h-5 w-5 text-gray-500" />
                    </div>

                    <span className="text-sm text-gray-500">Capacity</span>
                  </div>

                  <span className="text-sm font-medium text-gray-900">
                    {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                      <HiOutlineMapPin className="h-5 w-5 text-gray-500" />
                    </div>

                    <span className="text-sm text-gray-500">Location</span>
                  </div>

                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {table.location}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                  <span className="text-sm text-gray-500">Status</span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${currentStatus.badge}`}
                  >
                    {table.status}
                  </span>
                </div>
              </div>
            </section>

            {/* Session */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-950">
                  Current session
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Active activity for this table.
                </p>
              </div>

              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No active session
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Active orders and sessions will appear here.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Danger zone */}
        <section className="rounded-xl border border-red-100 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Delete table
              </h2>

              <p className="mt-1 text-sm text-gray-500">
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

      {/* Confirmation */}
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
