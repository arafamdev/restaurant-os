import { useQuery } from "@tanstack/react-query";
import { getTables } from "../services/tableService";

export function useTables() {
  const {
    isLoading,
    data: tables,
    error,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  return {
    isLoading,
    tables,
    error,
  };
}
