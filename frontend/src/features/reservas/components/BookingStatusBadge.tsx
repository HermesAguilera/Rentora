import type { BookingStatus } from '../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'PENDIENTE',
  confirmed: 'CONFIRMADO',
  active: 'ACTIVO',
  completed: 'FINALIZADO',
  disputed: 'EN DISPUTA',
  cancelled_by_renter: 'CANCELADO',
  cancelled_by_host: 'CANCELADO',
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending: 'text-[#f5b544]',
  confirmed: 'text-[#4d44b5]',
  active: 'text-[#4cbc9a]',
  completed: 'text-[#fb7d5b]',
  disputed: 'text-[#e2665c]',
  cancelled_by_renter: 'text-[#a098ae]',
  cancelled_by_host: 'text-[#a098ae]',
};

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <span className={`font-['Poppins',sans-serif] text-sm font-bold ${STATUS_COLOR[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
