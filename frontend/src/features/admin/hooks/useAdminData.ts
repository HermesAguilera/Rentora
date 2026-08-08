import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  applyUserAction,
  approveSpace,
  getAdminSpaces,
  getAdminStats,
  getAdminUsers,
  rejectSpace,
} from '../../../services/adminService';
import type { UserAction } from '../../../services/adminService';
import type { SpaceStatus } from '../../espacios/types';

const adminKeys = {
  stats: ['admin', 'stats'] as const,
  spaces: (status?: SpaceStatus) => ['admin', 'spaces', status ?? 'all'] as const,
  users: ['admin', 'users'] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: getAdminStats,
  });
}

export function useAdminSpaces(status?: SpaceStatus) {
  return useQuery({
    queryKey: adminKeys.spaces(status),
    queryFn: () => getAdminSpaces(status),
  });
}

export function useModerateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      reason ? rejectSpace(id, reason) : approveSpace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users,
    queryFn: getAdminUsers,
  });
}

export function useUserAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: UserAction; reason?: string }) =>
      applyUserAction(id, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}
