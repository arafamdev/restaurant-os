import { RESERVATION_TIME_OPTIONS } from "../../../constants";

function TimeSlotPicker({ value, onChange, isTimeDisabled }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {RESERVATION_TIME_OPTIONS.map((option) => {
        const isSelected = option.value === value;
        const isDisabled = isTimeDisabled?.(option.value);

        return (
          <button
            key={option.value}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
              isDisabled
                ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                : isSelected
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSlotPicker;
