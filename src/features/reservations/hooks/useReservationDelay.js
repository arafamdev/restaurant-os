import { useEffect, useState } from "react";

import { getReservationDelay } from "../utils/reservationUtils";

function useReservationDelay(startsAt) {
  const [delay, setDelay] = useState(() => getReservationDelay(startsAt));

  useEffect(() => {
    function updateDelay() {
      setDelay(getReservationDelay(startsAt));
    }

    updateDelay();

    const interval = setInterval(updateDelay, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startsAt]);

  return delay;
}

export default useReservationDelay;
