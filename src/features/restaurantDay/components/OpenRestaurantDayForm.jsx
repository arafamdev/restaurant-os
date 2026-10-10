import { useState } from "react";

import Button from "../../../ui/Button";
import { useOpenRestaurantDay } from "../hooks/useOpenRestaurantDay";

function OpenRestaurantDayForm({ isOpen, onClose }) {
  const { openRestaurantDay, isOpening } = useOpenRestaurantDay();

  const [businessDate, setBusinessDate] = useState("");
  const [openingCash, setOpeningCash] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    openRestaurantDay(
      {
        businessDate,
        openingCash,
        notes,
      },
      {
        onSuccess: () => {
          setBusinessDate("");
          setOpeningCash("");
          setNotes("");
          onClose();
        },
      },
    );
  }

  if (!isOpen) return null;

  const inputStyles =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-[#0B1120] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-emerald-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="open-restaurant-day-title"
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-7 dark:border-gray-800 dark:bg-[#111827]"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="open-restaurant-day-title"
              className="text-xl font-semibold tracking-tight text-gray-950 dark:text-gray-100"
            >
              Open Restaurant Day
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-gray-500 dark:text-gray-400">
              Start a new operating day for the restaurant.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isOpening}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="businessDate"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Business date
            </label>

            <input
              id="businessDate"
              type="date"
              value={businessDate}
              onChange={(event) => setBusinessDate(event.target.value)}
              required
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="openingCash"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Opening cash (€)
            </label>

            <input
              id="openingCash"
              type="number"
              min="0"
              step="0.01"
              value={openingCash}
              onChange={(event) => setOpeningCash(event.target.value)}
              required
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="openingNotes"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>

            <textarea
              id="openingNotes"
              rows="3"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes about the opening..."
              className={`${inputStyles} resize-y`}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
            <Button
              type="button"
              variation="secondary"
              onClick={onClose}
              disabled={isOpening}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isOpening}>
              {isOpening ? "Opening..." : "Open Restaurant Day"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OpenRestaurantDayForm;
