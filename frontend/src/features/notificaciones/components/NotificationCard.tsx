import { formatNotificationDate } from '../../../utils/date';
import type { Notification, NotificationCategory } from '../types';

interface NotificationCardProps {
  notification: Notification;
}

const CATEGORY_ICON: Record<NotificationCategory, string> = {
  payment: '💳',
  booking: '🗓️',
  message: '💬',
  verification: '✓',
};

const CATEGORY_COLOR: Record<NotificationCategory, { bg: string; text: string }> = {
  payment: { bg: 'bg-[#fdf1d0]', text: 'text-[#b9820b]' },
  booking: { bg: 'bg-[#dcf5e3]', text: 'text-[#1f8a4c]' },
  message: { bg: 'bg-[#d6d3f0]', text: 'text-[#2b3073]' },
  verification: { bg: 'bg-[#f7d3d4]', text: 'text-[#b23b3f]' },
};

export default function NotificationCard({ notification }: NotificationCardProps) {
  const { bg, text } = CATEGORY_COLOR[notification.category];

  return (
    <li className="flex items-center gap-4 rounded-2xl border border-[#e7e8f2] bg-white px-5 py-4">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-base ${bg} ${text}`}
      >
        {CATEGORY_ICON[notification.category]}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-['Poppins',sans-serif] text-sm font-bold text-[#1a1b3a]">
          {notification.title}
        </p>
        <p className="truncate font-['Quicksand',sans-serif] text-xs text-[#7d7e93]">
          {notification.description}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <p className="font-['Quicksand',sans-serif] text-[11px] text-[#7d7e93]">
          {formatNotificationDate(notification.date)}
        </p>
        {!notification.read && <span className="size-[7px] shrink-0 rounded-full bg-[#e5484d]" />}
      </div>
    </li>
  );
}
