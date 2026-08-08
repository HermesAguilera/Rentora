import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSpaces, toggleSpaceStatus } from '../../../services/espaciosService';
import type { SpaceStatus } from '../types';

const espaciosKeys = {
  spaces: ['espacios', 'spaces'] as const,
};

export function useSpaces() {
  return useQuery({
    queryKey: espaciosKeys.spaces,
    queryFn: getSpaces,
  });
}

export function useToggleSpaceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SpaceStatus }) =>
      toggleSpaceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: espaciosKeys.spaces });
    },
  });
}
