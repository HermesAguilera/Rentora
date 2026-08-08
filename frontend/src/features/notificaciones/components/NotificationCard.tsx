import { ChevronRight } from 'lucide-react';
import { formatNotificationDate } from '../../../utils/date';
import type { Notification, NotificationCategory } from '../types';

interface NotificationCardProps {
  notification: Notification;
  onOpen: (notification: Notification) => void;
}

const CATEGORY_ICON: Record<NotificationCategory, string> = {
  payment: '💳',
  booking: '🗓️',
  message: '💬',
  verification: '✓',
  space: '🏠',
};

const CATEGORY_COLOR: Record<NotificationCategory, { bg: string; text: string }> = {
  payment: { bg: 'bg-[#fdf1d0]', text: 'text-[#b9820b]' },
  booking: { bg: 'bg-[#dcf5e3]', text: 'text-[#1f8a4c]' },
  message: { bg: 'bg-[#d6d3f0]', text: 'text-[#2b3073]' },
  verification: { bg: 'bg-[#f7d3d4]', text: 'text-[#b23b3f]' },
  space: { bg: 'bg-[#e7e8f2]', text: 'text-[#4d44b5]' },
};

export default function NotificationCard({ notification, onOpen }: NotificationCardProps) {
  const { bg, text } = CATEGORY_COLOR[notification.category];
  const isClickable = notification.url !== null;

  const content = (
    <>
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-base ${bg} ${text}`}
      >
        {CATEGORY_ICON[notification.category]}
      </span>

      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-['Poppins',sans-serif] text-sm font-bold text-[#1a1b3a]">
          {notification.title}
        </p>
        <p className="truncate font-['Quicksand',sans-serif] text-xs text-[#7d7e93]">
          {notification.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex flex-col items-end gap-1.5">
          <p className="font-['Quicksand',sans-serif] text-[11px] text-[#7d7e93]">
            {formatNotificationDate(notification.date)}
          </p>
          {!notification.read && <span className="size-[7px] rounded-full bg-[#e5484d]" />}
        </div>
        {isClickable && <ChevronRight className="size-4 text-[#a098ae]" />}
      </div>
    </>
  );

  const baseClass = `flex w-full items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
    notification.read ? 'border-[#e7e8f2] bg-white' : 'border-[#d6d3f0] bg-[#fbfbff]'
  }`;

  if (!isClickable) {
    return <li className={baseClass}>{content}</li>;
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className={`${baseClass} cursor-pointer hover:border-[#4d44b5]`}
      >
        {content}
      </button>
    </li>
  );
}
