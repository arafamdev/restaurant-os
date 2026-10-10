import Select from "../../../ui/Select";

import { useCustomers } from "../hooks/useCustomers";

function CustomerSelect({ value, onChange }) {
  const { customers = [], isLoading, error } = useCustomers();

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Loading customers...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Could not load customers.
      </p>
    );
  }

  if (customers.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No customers available.
      </p>
    );
  }

  const options = customers.map((customer) => ({
    value: customer.id,
    label: customer.full_name,
  }));

  return <Select value={value} onChange={onChange} options={options} />;
}

export default CustomerSelect;
