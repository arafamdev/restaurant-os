import { useTables } from "../features/tables/hooks/useTables";

import TableList from "../features/tables/components/TableList";
import Spinner from "../ui/Spinner";
import { NavLink } from "react-router-dom";
import Button from "../ui/Button";

function Tables() {
  const { tables, isLoading, error } = useTables();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tables</h1>

        <p className="mt-1 text-sm text-gray-500">Manage restaurant tables.</p>
      </div>

      <div className="flex justify-end">
        <NavLink to="/tables/new">
          <Button>Create new table</Button>
        </NavLink>
      </div>

      <TableList tables={tables} />
    </div>
  );
}

export default Tables;
