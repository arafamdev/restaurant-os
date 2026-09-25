import { useNavigate } from "react-router-dom";

import TableForm from "../features/tables/components/TableForm";
import BackButton from "../ui/BackButton";

function CreateTable() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/tables");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton />

      <div className="mb-6">
        <h1 className="mt-5 text-2xl font-semibold text-gray-900">
          Create table
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new table to the restaurant.
        </p>
      </div>

      <TableForm onSuccess={handleSuccess} />
    </div>
  );
}

export default CreateTable;
