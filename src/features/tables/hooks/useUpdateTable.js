import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateTable } from "../services/tableService";

export function useUpdateTable() {
  const queryClient = useQueryClient();

  const { mutate: updateTableMutation, isPending } = useMutation({
    mutationFn: ({ id, updatedTable }) => updateTable(id, updatedTable),

    // success
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      queryClient.invalidateQueries({
        queryKey: ["table", data.id],
      });

      toast.success("Table updated successfully");
    },

    // error
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    updateTable: updateTableMutation,
    isUpdating: isPending,
  };
}
