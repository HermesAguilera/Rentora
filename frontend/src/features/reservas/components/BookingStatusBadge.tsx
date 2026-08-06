import type { BookingStatus } from '../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  active: 'ACTIVO',
  finished: 'FINALIZADO',
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  active: 'text-[#4cbc9a]',
  finished: 'text-[#fb7d5b]',
};

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <span className={`font-['Poppins',sans-serif] text-sm font-bold ${STATUS_COLOR[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
