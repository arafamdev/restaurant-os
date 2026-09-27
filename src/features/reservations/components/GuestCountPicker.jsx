// Selecao do numeros de convidados

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

    if (number >= 6) {
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
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                isSelected
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
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
          className="mb-1.5 block text-xs font-medium text-gray-500"
        >
          More than 5 guests?
        </label>

        <input
          id="guest-count"
          type="number"
          min="6"
          value={customValue}
          onChange={handleCustomChange}
          placeholder="Enter number of guests"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
    </div>
  );
}

export default GuestCountPicker;
