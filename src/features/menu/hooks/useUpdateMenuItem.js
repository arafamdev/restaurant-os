import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { updateMenuItem } from "../services/menuService";

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, updatedMenuItem }) =>
      updateMenuItem(id, updatedMenuItem),

    onSuccess: (_data, variables) => {
      toast.success("Menu item updated successfully.");

      // Atualiza a lista do menu.
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });

      // O useParams() devolve o ID como string.
      // Normalizamos aqui para garantir que a queryKey
      // do detalhe corresponde exatamente à queryKey usada
      // pelo useMenuItem().
      queryClient.invalidateQueries({
        queryKey: ["menu-item", String(variables.id)],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    updateItem,
    isUpdating,
  };
}
