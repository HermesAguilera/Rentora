import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../../../services/notificacionesService';

const notificacionesKeys = {
  notifications: ['notificaciones', 'notifications'] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificacionesKeys.notifications,
    queryFn: getNotifications,
  });
}
