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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Open Restaurant Day
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Start a new operating day for the restaurant.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isOpening}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="businessDate"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Business date
            </label>

            <input
              id="businessDate"
              type="date"
              value={businessDate}
              onChange={(event) => setBusinessDate(event.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="openingCash"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Opening cash
            </label>

            <input
              id="openingCash"
              type="number"
              min="0"
              step="0.01"
              value={openingCash}
              onChange={(event) => setOpeningCash(event.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="openingNotes"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>

            <textarea
              id="openingNotes"
              rows="3"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes about the opening..."
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
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
