import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAllAsRead, markAsRead } from '../../../services/notificacionesService';

const notificacionesKeys = {
  notifications: ['notificaciones', 'notifications'] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificacionesKeys.notifications,
    queryFn: getNotifications,
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificacionesKeys.notifications,
    queryFn: getNotifications,
    select: (notifications) => notifications.filter((item) => !item.read).length,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | 'all') => (id === 'all' ? markAllAsRead() : markAsRead(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificacionesKeys.notifications });
    },
  });
}
