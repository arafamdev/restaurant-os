import { supabase } from "../../../services/supabase";

// Estes estados ocupam uma mesa.
const ACTIVE_RESERVATION_STATUSES = ["pending", "confirmed", "seated"];

export async function getAvailableTables({ startsAt, endsAt, guests }) {
  // Primeiro procuramos apenas mesas
  // que conseguem receber este grupo.
  const { data: tables, error: tablesError } = await supabase
    .from("tables")
    .select("id, table_number, capacity, location")
    .gte("capacity", guests)
    .order("table_number");

  if (tablesError) {
    throw new Error(tablesError.message);
  }

  if (!tables.length) {
    return [];
  }

  // Guardamos os IDs das mesas.
  const tableIds = tables.map((table) => table.id);

  // Procuramos reservas que possam bloquear
  // essas mesas no período escolhido.
  const { data: reservations, error: reservationsError } = await supabase
    .from("reservations")
    .select("table_id")

    // Só verificamos as mesas que têm
    // capacidade suficiente.
    .in("table_id", tableIds)

    // Só reservas ativas bloqueiam a mesa.
    .in("status", ACTIVE_RESERVATION_STATUSES)

    // A reserva existente começa antes
    // da nossa reserva terminar.
    .lt("starts_at", endsAt)

    // A reserva existente termina depois
    // da nossa reserva começar.
    .gt("ends_at", startsAt);

  if (reservationsError) {
    throw new Error(reservationsError.message);
  }

  // Criamos um Set com os IDs das mesas ocupadas.
  const occupiedTableIds = new Set(
    reservations.map((reservation) => reservation.table_id),
  );

  // Retornamos somente as mesas
  // que não estão no Set das ocupadas.
  return tables.filter((table) => !occupiedTableIds.has(table.id));
}
