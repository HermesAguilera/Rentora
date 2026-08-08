import { api } from '../lib/api';
import type { ApiSpace } from './clienteEspaciosService';
import type { BookingStatus } from '../features/reservas/types';

/** `BookingResource` del backend. */
export interface ApiBooking {
  id: string;
  space?: ApiSpace;
  renter?: { id: string; name: string; avatar_url: string | null };
  host?: { id: string; name: string; avatar_url: string | null };
  status: BookingStatus;
  start_date: string;
  end_date: string | null;
  months_duration: number;
  total_amount: number;
  platform_fee_amount: number;
  platform_fee_percentage: number;
  host_payout_amount: number;
  /** Fecha en que el anfitrión confirmó haber recibido el pago; null si sigue pendiente. */
  payment_confirmed_at: string | null;
  created_at: string;
}

/**
 * Las reservas no tienen código propio en la BD. Usamos la cola del uuid porque
 * los uuid son ordenados y el prefijo es igual para todas las filas creadas juntas.
 */
export function bookingCode(id: string): string {
  return `#${id.slice(-8).toUpperCase()}`;
}

export async function getBookings(as: 'renter' | 'host'): Promise<ApiBooking[]> {
  const { data } = await api.get<{ data: ApiBooking[] }>('/bookings', { params: { as } });
  return data.data;
}

export async function createBooking(
  spaceId: string,
  startDate: string,
  monthsDuration: number,
): Promise<ApiBooking> {
  const { data } = await api.post<ApiBooking>('/bookings', {
    space_uuid: spaceId,
    start_date: startDate,
    months_duration: monthsDuration,
  });
  return data;
}

export async function confirmBooking(id: string): Promise<void> {
  await api.post(`/bookings/${id}/confirm`);
}

export async function cancelBooking(id: string, reason: string): Promise<void> {
  await api.post(`/bookings/${id}/cancel`, { cancellation_reason: reason });
}

/** El anfitrión marca que ya recibió el pago de la reserva. */
export async function confirmBookingPayment(id: string): Promise<void> {
  await api.post(`/bookings/${id}/confirm-payment`);
}
