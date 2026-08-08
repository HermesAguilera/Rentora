import { useNavigate } from 'react-router-dom';
import { useMarkNotificationRead, useNotifications } from './hooks/useNotificacionesData';
import NotificationsList from './components/NotificationsList';
import type { Notification } from './types';

export default function NotificacionesPage() {
  const { data: notifications, isPending, isError } = useNotifications();
  const markRead = useMarkNotificationRead();
  const navigate = useNavigate();

  /** Abrir una notificación la marca como leída y lleva a lo que la originó. */
  function handleOpen(notification: Notification) {
    if (!notification.read) markRead.mutate(notification.id);
    if (notification.url) navigate(notification.url);
  }

  const hasUnread = notifications?.some((notification) => !notification.read) ?? false;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {hasUnread && (
        <button
          type="button"
          onClick={() => markRead.mutate('all')}
          disabled={markRead.isPending}
          className="w-fit self-end rounded-full border border-[#e7e8f2] bg-white px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073] transition-colors hover:border-[#4d44b5] disabled:opacity-40"
        >
          Marcar todas como leídas
        </button>
      )}

      <NotificationsList
        notifications={notifications}
        isPending={isPending}
        isError={isError}
        onOpen={handleOpen}
      />
    </div>
  );
}
