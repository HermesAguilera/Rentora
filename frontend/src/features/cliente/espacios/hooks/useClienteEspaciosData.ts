import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFavoriteSpaces,
  getSpace,
  getSpaceReviews,
  getSpaces,
  toggleFavorite,
} from '../../../../services/clienteEspaciosService';
import type { ClientSpace } from '../types';

const clienteEspaciosKeys = {
  spaces: ['cliente', 'espacios'] as const,
  favorites: ['cliente', 'espacios', 'favoritos'] as const,
  space: (id: string) => ['cliente', 'espacios', id] as const,
  reviews: (id: string) => ['cliente', 'espacios', id, 'resenas'] as const,
};

export function useSpaces() {
  return useQuery({
    queryKey: clienteEspaciosKeys.spaces,
    queryFn: getSpaces,
  });
}

export function useFavoriteSpaces() {
  return useQuery({
    queryKey: clienteEspaciosKeys.favorites,
    queryFn: getFavoriteSpaces,
  });
}

export function useSpace(id: string) {
  return useQuery({
    queryKey: clienteEspaciosKeys.space(id),
    queryFn: () => getSpace(id),
  });
}

export function useSpaceReviews(id: string) {
  return useQuery({
    queryKey: clienteEspaciosKeys.reviews(id),
    queryFn: () => getSpaceReviews(id),
    enabled: id.length > 0,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      toggleFavorite(id, isFavorite),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: clienteEspaciosKeys.spaces });
      const previous = queryClient.getQueryData<ClientSpace[]>(clienteEspaciosKeys.spaces);

      queryClient.setQueryData(
        clienteEspaciosKeys.spaces,
        (current: ClientSpace[] | undefined) =>
          current?.map((space) =>
            space.id === id ? { ...space, favorite: !space.favorite } : space,
          ) ?? current,
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(clienteEspaciosKeys.spaces, context.previous);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: clienteEspaciosKeys.spaces });
      queryClient.invalidateQueries({ queryKey: clienteEspaciosKeys.favorites });
      queryClient.invalidateQueries({ queryKey: clienteEspaciosKeys.space(id) });
    },
  });
}
