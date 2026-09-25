import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteTable } from "../services/tableService";

export function useDeleteTable() {
  const queryClient = useQueryClient();

  const { mutate: deleteTableMutation, isPending } = useMutation({
    mutationFn: deleteTable,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      toast.success("Table deleted successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    deleteTable: deleteTableMutation,
    isDeleting: isPending,
  };
}
