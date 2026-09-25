import { useNavigate, useParams } from "react-router-dom";

import { useTable } from "../features/tables/hooks/useTable";
import { useDeleteTable } from "../features/tables/hooks/useDeleteTable";

import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import BackButton from "../ui/BackButton";
import Button from "../ui/Button";

function TableDetails() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const { table, isLoading, error } = useTable(tableId);
  const { deleteTable, isDeleting } = useDeleteTable();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete Table ${table.table_number}?`,
    );

    if (!confirmed) return;

    deleteTable(table.id, {
      onSuccess: () => {
        navigate("/tables");
      },
    });
  }

  return (
    <div>
      <BackButton />

      <h1 className="mt-5 text-2xl font-semibold text-gray-900">
        Table {table.table_number}
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Table details and information.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Table number</p>
            <p className="mt-1 font-medium text-gray-900">
              {table.table_number}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="mt-1 font-medium text-gray-900">
              {table.capacity} {table.capacity === 1 ? "guest" : "guests"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="mt-1 font-medium capitalize text-gray-900">
              {table.location}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="mt-1 font-medium capitalize text-gray-900">
              {table.status}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variation="secondary"
          onClick={() => navigate(`/tables/${table.id}/edit`)}
        >
          Edit table
        </Button>

        <Button variation="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete table"}
        </Button>
      </div>
    </div>
  );
}

export default TableDetails;
