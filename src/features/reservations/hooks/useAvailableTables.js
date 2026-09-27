import { useQuery } from "@tanstack/react-query";

import { getAvailableTables } from "../services/availabilityService";

export function useAvailableTables({ startsAt, endsAt, guests }) {
  // Só podemos procurar mesas quando
  // temos todos os dados necessários.
  const isReady = Boolean(startsAt) && Boolean(endsAt) && Boolean(guests);

  const {
    isLoading,
    data: availableTables,
    error,
  } = useQuery({
    queryKey: ["availableTables", startsAt, endsAt, guests],

    // Função que realmente procura as mesas.
    queryFn: () =>
      getAvailableTables({
        startsAt,
        endsAt,
        guests,
      }),

    // Não executar enquanto faltarem dados.
    enabled: isReady,
  });

  return {
    isLoading,

    // Se ainda não houver dados,
    // devolvemos um array vazio.
    availableTables: availableTables ?? [],

    error,
  };
}
