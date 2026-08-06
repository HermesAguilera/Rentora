import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClientProfile, updateClientProfile } from '../../../../services/clientePerfilService';
import type { ClientProfile } from '../types';

const clientePerfilKeys = {
  profile: ['cliente', 'perfil'] as const,
};

export function useClientProfile() {
  return useQuery({
    queryKey: clientePerfilKeys.profile,
    queryFn: getClientProfile,
  });
}

export function useUpdateClientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<ClientProfile>) => updateClientProfile(patch),
    onSuccess: (next) => {
      queryClient.setQueryData(clientePerfilKeys.profile, next);
    },
  });
}
