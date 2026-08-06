import BookingStatusBadge from './BookingStatusBadge';
import { formatBookingDate } from '../../../utils/date';
import type { Booking } from '../types';

interface BookingRowProps {
  booking: Booking;
}

export default function BookingRow({ booking }: BookingRowProps) {
  return (
    <li className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="size-14 shrink-0 rounded-2xl bg-[#c1bbeb]" />
        <p className="truncate font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
          {booking.renterName}
        </p>
      </div>
      <p className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
        {booking.code}
      </p>
      <p className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
        {formatBookingDate(booking.startDate)}
      </p>
      <p className="truncate font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
        {booking.spaceTitle}
      </p>
      <BookingStatusBadge status={booking.status} />
    </li>
  );
}
