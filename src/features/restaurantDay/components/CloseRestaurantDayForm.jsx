import { useState } from "react";

import Button from "../../../ui/Button";
import { useCloseRestaurantDay } from "../hooks/useCloseRestaurantDay";

function CloseRestaurantDayForm({ isOpen, onClose }) {
  const { closeRestaurantDay, isClosing } = useCloseRestaurantDay();

  const [closingCash, setClosingCash] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    closeRestaurantDay(
      {
        closingCash,
        notes,
      },
      {
        onSuccess: () => {
          setClosingCash("");
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
              Close Restaurant Day
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Close the current operating day for the restaurant.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isClosing}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="closingCash"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Closing cash
            </label>

            <input
              id="closingCash"
              type="number"
              min="0"
              step="0.01"
              value={closingCash}
              onChange={(event) => setClosingCash(event.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="closingNotes"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>

            <textarea
              id="closingNotes"
              rows="3"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes about the closing..."
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variation="secondary"
              onClick={onClose}
              disabled={isClosing}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isClosing}>
              {isClosing ? "Closing..." : "Close Restaurant Day"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CloseRestaurantDayForm;
