import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useDeleteTable } from "../hooks/useDeleteTable";

import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";

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

        <div className="text-sm capitalize text-gray-600">{table.location}</div>

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

      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-lg font-semibold text-gray-900">Delete table?</h2>

          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete Table {table.table_number}? This
            action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variation="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variation="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete table"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default TableRow;
