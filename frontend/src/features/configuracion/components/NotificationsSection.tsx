import { useEffect, useState } from 'react';
import Toggle from '../../../components/shared/Toggle';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '../hooks/useConfiguracionData';
import type { NotificationChannel, NotificationPreferences, NotificationTopic } from '../types';

const TOPIC_LABEL: Record<NotificationTopic, string> = {
  payments: 'Pagos',
  bookings: 'Reservas',
  messages: 'Mensajes',
  account: 'Cuenta y verificación',
};

const TOPIC_ORDER: NotificationTopic[] = ['payments', 'bookings', 'messages', 'account'];

export default function NotificationsSection() {
  const { data: preferences, isPending } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const [local, setLocal] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    if (preferences) setLocal(preferences);
  }, [preferences]);

  function toggle(topic: NotificationTopic, channel: NotificationChannel) {
    if (!local) return;
    const next: NotificationPreferences = {
      ...local,
      [topic]: { ...local[topic], [channel]: !local[topic][channel] },
    };
    setLocal(next);
    updatePreferences.mutate(next);
  }

  if (isPending || !local) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-[#f4f5fc]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex max-w-md flex-col">
      <div className="grid grid-cols-[1fr_72px_72px] items-center gap-4 border-b border-[#f4f5fc] pb-3">
        <span className="font-['Quicksand',sans-serif] text-xs font-bold tracking-wide text-[#a098ae] uppercase">
          Tipo
        </span>
        <span className="text-center font-['Quicksand',sans-serif] text-xs font-bold tracking-wide text-[#a098ae] uppercase">
          Correo
        </span>
        <span className="text-center font-['Quicksand',sans-serif] text-xs font-bold tracking-wide text-[#a098ae] uppercase">
          Push
        </span>
      </div>

      {TOPIC_ORDER.map((topic) => (
        <div
          key={topic}
          className="grid grid-cols-[1fr_72px_72px] items-center gap-4 border-b border-[#f4f5fc] py-4 last:border-0"
        >
          <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
            {TOPIC_LABEL[topic]}
          </span>
          <span className="flex justify-center">
            <Toggle
              checked={local[topic].email}
              onChange={() => toggle(topic, 'email')}
              label={`Notificaciones de ${TOPIC_LABEL[topic]} por correo`}
            />
          </span>
          <span className="flex justify-center">
            <Toggle
              checked={local[topic].push}
              onChange={() => toggle(topic, 'push')}
              label={`Notificaciones push de ${TOPIC_LABEL[topic]}`}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
