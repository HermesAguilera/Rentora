import { useNotifications } from './hooks/useNotificacionesData';
import NotificationsList from './components/NotificationsList';

export default function NotificacionesPage() {
  const { data: notifications, isPending, isError } = useNotifications();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <NotificationsList notifications={notifications} isPending={isPending} isError={isError} />
    </div>
  );
}
