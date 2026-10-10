import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMapPin, HiOutlineUsers } from "react-icons/hi2";

import { useDeleteTable } from "../hooks/useDeleteTable";
import TableVisual from "./TableVisual";
import Button from "../../../ui/Button";
import ConfirmModal from "../../../ui/ConfirmModal";

function TableCard({ table, view = "compact", canManage = false, onEdit }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { deleteTable, isDeleting } = useDeleteTable();

  const statusStyles = {
    available:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
    occupied:
      "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
    maintenance:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  };

  const currentStatus = statusStyles[table.status] || statusStyles.available;

  const isLarge = view === "large";
  const isList = view === "list";

  function handleEdit() {
    if (!canManage) return;
    onEdit?.(table);
  }

  function handleDelete() {
    if (!canManage) return;

    deleteTable(table.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  }

  function handleOpenDeleteModal() {
    if (!canManage) return;
    setIsDeleteModalOpen(true);
  }

  const cardClassName = isList
    ? "group rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#1F2937]"
    : `group card-hover ${isLarge ? "p-5" : "p-4"}`;

  return (
    <>
      <article className={cardClassName}>
        <div className="flex items-start justify-between gap-3">
          <NavLink
            to={`/tables/${table.id}`}
            className="font-semibold tracking-tight text-gray-950 transition-colors hover:text-emerald-600 dark:text-[#F9FAFB] dark:hover:text-emerald-400"
          >
            Table {String(table.table_number).padStart(2, "0")}
          </NavLink>

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${currentStatus}`}
          >
            {table.status}
          </span>
        </div>

        <NavLink
          to={`/tables/${table.id}`}
          aria-label={`View table ${table.table_number}`}
          className={`flex justify-center ${isLarge ? "py-7" : "py-5"}`}
        >
          <TableVisual
            tableNumber={table.table_number}
            capacity={table.capacity}
            status={table.status}
            size={isLarge ? "large" : "compact"}
          />
        </NavLink>

        <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <HiOutlineUsers className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />

            <span>
              {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <HiOutlineMapPin className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />

            <span className="capitalize">{table.location}</span>
          </div>
        </div>

        {canManage && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variation="secondary"
              size="small"
              onClick={handleEdit}
            >
              Edit
            </Button>

            <Button
              type="button"
              variation="danger"
              size="small"
              onClick={handleOpenDeleteModal}
            >
              Delete
            </Button>
          </div>
        )}
      </article>

      {canManage && (
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
      )}
    </>
  );
}

export default TableCard;
