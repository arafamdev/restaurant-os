import { useQuery } from "@tanstack/react-query";
import { getTable } from "../services/tableService";

export function useTable(id) {
  const {
    isLoading,
    data: table,
    error,
  } = useQuery({
    queryKey: ["table", id],
    queryFn: () => getTable(id),
  });

  return {
    isLoading,
    table,
    error,
  };
}
