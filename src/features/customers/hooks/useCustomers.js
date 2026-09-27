import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../services/customerService";

export function useCustomers() {
  const {
    isLoading,
    data: customers,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return {
    isLoading,
    customers,
    error,
  };
}
