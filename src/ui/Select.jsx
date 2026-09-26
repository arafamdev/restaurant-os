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
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition outline-none hover:border-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <span>{selectedOption?.label}</span>

        <HiOutlineChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-2.5 text-left text-sm transition ${
                option.value === value
                  ? "bg-emerald-50 font-medium text-emerald-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
