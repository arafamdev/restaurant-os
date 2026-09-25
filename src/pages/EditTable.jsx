import { useNavigate, useParams } from "react-router-dom";

import { useTable } from "../features/tables/hooks/useTable";

import TableForm from "../features/tables/components/TableForm";

import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import BackButton from "../ui/BackButton";

function EditTable() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const { table, isLoading, error } = useTable(tableId);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  function handleSuccess() {
    navigate(`/tables/${table.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton />

      <div className="mb-6">
        <h1 className="mt-5 text-2xl font-semibold text-gray-900">
          Edit table
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the information for Table {table.table_number}.
        </p>
      </div>

      <TableForm tableToEdit={table} onSuccess={handleSuccess} />
    </div>
  );
}

export default EditTable;
