import { RESERVATION_STATUS } from "../../../constants";

import Select from "../../../ui/Select";
import DatePicker from "../../../ui/DatePicker";

function ReservationFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  selectedDate,
  onDateChange,
}) {
  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: RESERVATION_STATUS.PENDING, label: "Pending" },
    { value: RESERVATION_STATUS.CONFIRMED, label: "Confirmed" },
    { value: RESERVATION_STATUS.SEATED, label: "Seated" },
    { value: RESERVATION_STATUS.COMPLETED, label: "Completed" },
    { value: RESERVATION_STATUS.CANCELLED, label: "Cancelled" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search guest..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <Select
        value={statusFilter}
        onChange={onStatusChange}
        options={statusOptions}
      />

      <DatePicker selected={selectedDate} onSelect={onDateChange} />
    </div>
  );
}

export default ReservationFilters;
