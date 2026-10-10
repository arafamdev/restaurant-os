import { RESERVATION_TIME_OPTIONS } from "../../../constants";

function TimeSlotPicker({ value, onChange, isTimeDisabled }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {RESERVATION_TIME_OPTIONS.map((option) => {
        const isSelected = option.value === value;
        const isDisabled = isTimeDisabled?.(option.value);

        let buttonStyles;

        if (isDisabled) {
          buttonStyles =
            "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-600";
        } else if (isSelected) {
          buttonStyles =
            "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500 dark:text-gray-950";
        } else {
          buttonStyles =
            "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-200 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/5";
        }

        return (
          <button
            key={option.value}
            type="button"
            disabled={isDisabled}
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed ${buttonStyles}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSlotPicker;
