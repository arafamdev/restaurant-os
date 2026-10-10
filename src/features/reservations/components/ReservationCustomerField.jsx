import { Controller } from "react-hook-form";

import CustomerSelect from "../../customers/components/CustomerSelect";

function ReservationCustomerField({ control }) {
  return (
    <Controller
      name="customerId"
      control={control}
      rules={{
        required: "Please select a customer.",
      }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Customer
          </label>

          <CustomerSelect value={field.value} onChange={field.onChange} />

          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

export default ReservationCustomerField;
