import { LAST_RESERVATION_TIME } from "../../../constants";
import { createReservationDateTime } from "../../../utils/dateUtils";

export function getToday() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

export function isToday(date) {
  if (!date) return false;

  const selectedDate = new Date(date);
  const today = new Date();

  return (
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getDate() === today.getDate()
  );
}

export function isTimeInThePast(date, time) {
  if (!date || !isToday(date)) {
    return false;
  }

  const reservationDateTime = createReservationDateTime(date, time);

  return reservationDateTime <= new Date();
}

export function isReservationTimeClosedForToday() {
  const now = new Date();

  const lastReservationTime = createReservationDateTime(
    now,
    LAST_RESERVATION_TIME,
  );

  return now > lastReservationTime;
}

export function validateReservationDate(value) {
  if (!value) return true;

  const selectedDate = new Date(value);
  const today = getToday();

  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "Please select today or a future date.";
  }

  if (isToday(selectedDate) && isReservationTimeClosedForToday()) {
    return "Reservations for today are closed. Please select a future date.";
  }

  return true;
}

export function validateReservationTime(date, time) {
  if (!date || !time) {
    return true;
  }

  const startsAt = createReservationDateTime(date, time);

  return startsAt > new Date() || "Please select a future time.";
}
