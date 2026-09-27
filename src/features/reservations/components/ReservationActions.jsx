import { useState } from "react";

import { RESERVATION_STATUS } from "../../../constants";
import { canMarkReservationAsNoShow } from "../utils/reservationUtils";
import { RESERVATION_ACTION_CONFIG } from "../utils/reservationActionConfig";

import useReservationDelay from "../hooks/useReservationDelay";
import { useUpdateReservationStatus } from "../hooks/useUpdateReservationStatus";

import ReservationActionButton from "./ReservationActionButton";
import ReservationActionModal from "./ReservationActionModal";

function ReservationActions({ reservation }) {
  const [pendingAction, setPendingAction] = useState(null);

  const { updateStatus, isUpdating } = useUpdateReservationStatus();

  const { id, status, starts_at } = reservation;

  const delay = useReservationDelay(starts_at);

  const canMarkAsNoShow = canMarkReservationAsNoShow(status, delay);

  function requestStatusChange(newStatus) {
    setPendingAction(newStatus);
  }

  function closeModal() {
    if (isUpdating) return;

    setPendingAction(null);
  }

  function confirmStatusChange() {
    if (!pendingAction) return;

    updateStatus(
      {
        id,
        status: pendingAction,
      },
      {
        onSuccess: () => {
          setPendingAction(null);
        },
      },
    );
  }

  if (
    status === RESERVATION_STATUS.COMPLETED ||
    status === RESERVATION_STATUS.CANCELLED ||
    status === RESERVATION_STATUS.NO_SHOW
  ) {
    return null;
  }

  const selectedAction = pendingAction
    ? RESERVATION_ACTION_CONFIG[pendingAction]
    : null;

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {status === RESERVATION_STATUS.PENDING && (
          <>
            <ReservationActionButton
              onClick={() => requestStatusChange(RESERVATION_STATUS.CONFIRMED)}
              disabled={isUpdating}
            >
              Confirm reservation
            </ReservationActionButton>

            <ReservationActionButton
              variant="danger"
              onClick={() => requestStatusChange(RESERVATION_STATUS.CANCELLED)}
              disabled={isUpdating}
            >
              Cancel reservation
            </ReservationActionButton>
          </>
        )}

        {status === RESERVATION_STATUS.CONFIRMED && (
          <>
            <ReservationActionButton
              variant="blue"
              onClick={() => requestStatusChange(RESERVATION_STATUS.SEATED)}
              disabled={isUpdating}
            >
              Mark as seated
            </ReservationActionButton>

            {canMarkAsNoShow && (
              <ReservationActionButton
                variant="warning"
                onClick={() => requestStatusChange(RESERVATION_STATUS.NO_SHOW)}
                disabled={isUpdating}
              >
                Mark as no-show
              </ReservationActionButton>
            )}

            <ReservationActionButton
              variant="danger"
              onClick={() => requestStatusChange(RESERVATION_STATUS.CANCELLED)}
              disabled={isUpdating}
            >
              Cancel reservation
            </ReservationActionButton>
          </>
        )}

        {status === RESERVATION_STATUS.SEATED && (
          <ReservationActionButton
            variant="dark"
            onClick={() => requestStatusChange(RESERVATION_STATUS.COMPLETED)}
            disabled={isUpdating}
          >
            Complete reservation
          </ReservationActionButton>
        )}
      </div>

      <ReservationActionModal
        action={selectedAction}
        isUpdating={isUpdating}
        onClose={closeModal}
        onConfirm={confirmStatusChange}
      />
    </>
  );
}

export default ReservationActions;
