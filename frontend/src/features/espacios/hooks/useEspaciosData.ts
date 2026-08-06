import { useQuery } from '@tanstack/react-query';
import { getSpaces } from '../../../services/espaciosService';

const espaciosKeys = {
  spaces: ['espacios', 'spaces'] as const,
};

export function useSpaces() {
  return useQuery({
    queryKey: espaciosKeys.spaces,
    queryFn: getSpaces,
  });
}
