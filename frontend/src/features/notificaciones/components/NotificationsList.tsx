import type { Notification } from '../types';
import NotificationCard from './NotificationCard';

interface NotificationsListProps {
  notifications: Notification[] | undefined;
  isPending: boolean;
  isError: boolean;
}

export default function NotificationsList({
  notifications,
  isPending,
  isError,
}: NotificationsListProps) {
  if (isError) {
    return (
      <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
        No se pudieron cargar las notificaciones.
      </p>
    );
  }

  if (isPending) {
    return (
      <ul className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-white p-4">
            <div className="size-11 shrink-0 rounded-xl bg-[#f4f5fc]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 rounded bg-[#f4f5fc]" />
              <div className="h-3 w-56 rounded bg-[#f4f5fc]" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
        No tienes notificaciones.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </ul>
  );
}
