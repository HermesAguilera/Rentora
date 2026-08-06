import { useMutation } from '@tanstack/react-query';
import { publishSpace } from '../../../../services/publicarEspacioService';
import type { NewSpaceInput } from '../types';

export function usePublishSpace() {
  return useMutation({
    mutationFn: (input: NewSpaceInput) => publishSpace(input),
  });
}
