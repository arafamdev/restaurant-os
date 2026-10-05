import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useDeleteTable } from "../hooks/useDeleteTable";

import Button from "../../../ui/Button";
import ConfirmModal from "../../../ui/ConfirmModal";

function TableRow({ table }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const { deleteTable, isDeleting } = useDeleteTable();

  const statusStyles = {
    available: "bg-emerald-50 text-emerald-700",
    occupied: "bg-blue-50 text-blue-700",
    maintenance: "bg-amber-50 text-amber-700",
  };

  function handleDelete() {
    deleteTable(table.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  }

  return (
    <>
      <li className="grid grid-cols-5 items-center gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0">
        <div>
          <NavLink
            to={`/tables/${table.id}`}
            className="font-medium text-gray-900 hover:text-emerald-600"
          >
            Table {table.table_number}
          </NavLink>
        </div>

        <div className="text-sm text-gray-600">
          {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
        </div>

        <div className="text-sm text-gray-600 capitalize">{table.location}</div>

        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
              statusStyles[table.status]
            }`}
          >
            {table.status}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
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
      </li>

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

export default TableRow;
