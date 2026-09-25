import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createTable } from "../services/tableService";

export function useCreateTable() {
  const queryClient = useQueryClient();

  const { mutate: createTableMutation, isPending } = useMutation({
    mutationFn: createTable,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      toast.success("Table created successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createTable: createTableMutation,
    isCreating: isPending,
  };
}
