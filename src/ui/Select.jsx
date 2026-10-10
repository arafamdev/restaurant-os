
import { useCallback, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

import useOutsideClick from "../hooks/useOutsideClick";

function Select({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSelect = useCallback(() => {
    setIsOpen(false);
  }, []);

  const selectRef = useOutsideClick(closeSelect);
  const selectedOption = options.find((option) => option.value === value);

  function handleSelect(option) {
    onChange(option.value);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition outline-none hover:border-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-[#374151] dark:bg-[#1F2937] dark:text-[#F9FAFB] dark:hover:border-gray-600 dark:focus:border-emerald-800 dark:focus:ring-emerald-950"
      >
        <span>{selectedOption?.label ?? "Select an option"}</span>

        <HiOutlineChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform dark:text-[#9CA3AF] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-[#374151] dark:bg-[#111827]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2.5 text-left text-sm transition ${
                  isSelected
                    ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#1F2937]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Select;