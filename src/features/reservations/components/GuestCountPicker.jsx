import { useState } from "react";

const QUICK_GUEST_OPTIONS = [1, 2, 3, 4, 5];

function GuestCountPicker({ value, onChange }) {
  const [customValue, setCustomValue] = useState("");

  function handleQuickSelect(count) {
    setCustomValue("");
    onChange(count);
  }

  function handleCustomChange(event) {
    const inputValue = event.target.value;

    setCustomValue(inputValue);

    if (inputValue === "") {
      onChange(undefined);
      return;
    }

    const number = Number(inputValue);

    if (Number.isFinite(number) && number >= 6) {
      onChange(number);
    }
  }

  const selectedQuickOption =
    customValue === "" && value <= 5 ? value : undefined;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {QUICK_GUEST_OPTIONS.map((count) => {
          const isSelected = selectedQuickOption === count;

          return (
            <button
              key={count}
              type="button"
              onClick={() => handleQuickSelect(count)}
              aria-pressed={isSelected}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500 dark:text-gray-950"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-200 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/5"
              }`}
            >
              {count}
            </button>
          );
        })}
      </div>

      <div>
        <label
          htmlFor="guest-count"
          className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          More than 5 guests?
        </label>

        <input
          id="guest-count"
          type="number"
          min="6"
          step="1"
          value={customValue}
          onChange={handleCustomChange}
          placeholder="Enter number of guests"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/10"
        />
      </div>
    </div>
  );
}

export default GuestCountPicker;
