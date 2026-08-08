import { bookingCode, getBookings as fetchBookings } from './bookingsApi';
import type { Booking } from '../features/reservas/types';

/** Reservas recibidas en los espacios del anfitrión que tiene la sesión abierta. */
export async function getBookings(): Promise<Booking[]> {
  const bookings = await fetchBookings('host');

  return bookings.map((booking) => ({
    id: booking.id,
    code: bookingCode(booking.id),
    renterName: booking.renter?.name ?? 'Inquilino',
    renterAvatarUrl: booking.renter?.avatar_url ?? null,
    startDate: booking.start_date,
    spaceTitle: booking.space?.title ?? '',
    status: booking.status,
  }));
}
