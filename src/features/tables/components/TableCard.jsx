import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMapPin, HiOutlineUsers } from "react-icons/hi2";

import { useDeleteTable } from "../hooks/useDeleteTable";

import TableVisual from "./TableVisual";

import Button from "../../../ui/Button";
import ConfirmModal from "../../../ui/ConfirmModal";

function TableCard({ table, view = "compact" }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const { deleteTable, isDeleting } = useDeleteTable();

  const statusStyles = {
    available: "bg-emerald-50 text-emerald-700",
    occupied: "bg-blue-50 text-blue-700",
    maintenance: "bg-amber-50 text-amber-700",
  };

  const currentStatus = statusStyles[table.status] || statusStyles.available;

  function handleDelete() {
    deleteTable(table.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  }

  const isLarge = view === "large";

  return (
    <>
      <article
        className={`group rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md ${
          isLarge ? "p-5" : "p-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <NavLink
            to={`/tables/${table.id}`}
            className="font-semibold tracking-tight text-gray-950 transition-colors hover:text-emerald-600"
          >
            Table {String(table.table_number).padStart(2, "0")}
          </NavLink>

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${currentStatus}`}
          >
            {table.status}
          </span>
        </div>

        {/* Visual */}
        <NavLink
          to={`/tables/${table.id}`}
          className={`flex justify-center ${isLarge ? "py-7" : "py-5"}`}
        >
          <TableVisual
            tableNumber={table.table_number}
            capacity={table.capacity}
            status={table.status}
            size={isLarge ? "large" : "compact"}
          />
        </NavLink>

        {/* Meta */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <HiOutlineUsers className="h-4 w-4 text-gray-400" />

            <span>
              {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
            <HiOutlineMapPin className="h-4 w-4 text-gray-400" />

            <span>{table.location}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Button
            variation="secondary"
            size="small"
            onClick={() => navigate(`/tables/${table.id}/edit`)}
          >
            Edit
          </Button>

          <Button
            variation="danger"
            size="small"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </article>

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

export default TableCard;
