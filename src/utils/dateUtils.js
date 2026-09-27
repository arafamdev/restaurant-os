import { format, parseISO } from "date-fns";

export function formatReservationDate(startsAt, endsAt) {
  const startDate = parseISO(startsAt);
  const endDate = parseISO(endsAt);

  const date = format(startDate, "dd MMM yyyy");
  const startTime = format(startDate, "HH:mm");
  const endTime = format(endDate, "HH:mm");

  return `${date} · ${startTime}–${endTime}`;
}

export function createReservationDateTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);

  const reservationDate = new Date(date);

  reservationDate.setHours(hours, minutes, 0, 0);

  return reservationDate;
}
