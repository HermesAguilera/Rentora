import { api } from '../lib/api';
import type { Notification, NotificationCategory } from '../features/notificaciones/types';

/** Fila cruda de la tabla `notifications` de Laravel. */
interface ApiNotification {
  id: string;
  data: {
    category?: NotificationCategory;
    title?: string;
    description?: string;
    space_uuid?: string;
    url?: string;
  };
  read_at: string | null;
  created_at: string;
}

/**
 * Las notificaciones nuevas traen `url`. Para las creadas antes de ese cambio
 * deducimos el destino por categoría para que sigan siendo clicables.
 */
function destinationOf(data: ApiNotification['data']): string | null {
  if (data.url) return data.url;
  if (data.space_uuid) return `/app/espacios/${data.space_uuid}`;
  if (data.category === 'booking') return '/dashboard/reservas';
  return null;
}

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get<{ data: ApiNotification[] }>('/me/notifications');

  return data.data.map((notification) => ({
    id: notification.id,
    category: notification.data.category ?? 'verification',
    title: notification.data.title ?? 'Notificación',
    description: notification.data.description ?? '',
    date: notification.created_at,
    read: notification.read_at !== null,
    url: destinationOf(notification.data),
  }));
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/me/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/me/notifications/read-all');
}
