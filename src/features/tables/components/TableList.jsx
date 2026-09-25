import TableRow from "./TableRow";

function TableList({ tables }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-5 gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        <div>Table</div>
        <div>Capacity</div>
        <div>Location</div>
        <div>Status</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Rows */}
      <ul>
        {tables.map((table) => (
          <TableRow key={table.id} table={table} />
        ))}
      </ul>
    </div>
  );
}

export default TableList;
