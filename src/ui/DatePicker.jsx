import { useCallback, useState } from "react";

import { DayPicker } from "@daypicker/react";

import { HiOutlineCalendarDays } from "react-icons/hi2";

import { format } from "date-fns";

import useOutsideClick from "../hooks/useOutsideClick";

function DatePicker({ selected, onSelect, minDate, disabledDate }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDatePicker = useCallback(() => {
    setIsOpen(false);
  }, []);

  const datePickerRef = useOutsideClick(closeDatePicker);

  const disabledDays = [
    minDate ? { before: minDate } : undefined,
    disabledDate,
  ].filter(Boolean);

  return (
    <div className="relative" ref={datePickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition outline-none hover:border-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <span className="flex items-center gap-2">
          <HiOutlineCalendarDays className="h-5 w-5 text-gray-500" />

          {selected ? format(selected, "dd MMM yyyy") : "Select date"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onSelect(date);
              setIsOpen(false);
            }}
            disabled={disabledDays}
          />

          {selected && (
            <button
              type="button"
              onClick={() => {
                onSelect(undefined);
                setIsOpen(false);
              }}
              className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DatePicker;
