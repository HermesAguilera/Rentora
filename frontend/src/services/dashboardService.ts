import { api } from '../lib/api';
import {
  cancelBooking,
  confirmBooking,
  confirmBookingPayment,
  getBookings,
} from './bookingsApi';
import type { ApiBooking } from './bookingsApi';
import type {
  DashboardSummary,
  IncomeBalance,
  Paginated,
  PendingRequest,
  Payment,
} from '../features/dashboard/types';

/**
 * El backend no expone un endpoint de resumen para anfitriones, así que el
 * dashboard se arma a partir de `/me/spaces` y `/bookings?as=host`.
 */
const EARNING_STATUSES = ['confirmed', 'active', 'completed'];

function isEarning(booking: ApiBooking): boolean {
  return EARNING_STATUSES.includes(booking.status);
}

/** Renta mensual de la reserva (el total cubre `months_duration` meses). */
function monthlyAmount(booking: ApiBooking): number {
  return booking.months_duration > 0 ? booking.total_amount / booking.months_duration : 0;
}

/**
 * Meses que cubre la reserva, como pares año-mes. Un alquiler de 6 meses
 * genera ingreso en los 6, no solo en el mes en que empezó.
 */
function monthsCovered(booking: ApiBooking): { year: number; month: number }[] {
  const start = new Date(booking.start_date);

  return Array.from({ length: booking.months_duration }, (_, offset) => {
    const date = new Date(start.getFullYear(), start.getMonth() + offset, 1);
    return { year: date.getFullYear(), month: date.getMonth() };
  });
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [spacesResponse, statsResponse, bookings] = await Promise.all([
    api.get<{ total: number; data: { status: string }[] }>('/me/spaces', {
      params: { per_page: 100 },
    }),
    api.get<{ data: { average_rating_received: number } }>('/users/me/stats'),
    getBookings('host'),
  ]);

  const now = new Date();
  const incomeThisMonth = bookings
    .filter(
      (booking) =>
        isEarning(booking) &&
        monthsCovered(booking).some(
          (covered) => covered.year === now.getFullYear() && covered.month === now.getMonth(),
        ),
    )
    .reduce((total, booking) => total + monthlyAmount(booking), 0);

  return {
    publishedSpaces: spacesResponse.data.data.filter((space) => space.status === 'active').length,
    incomeThisMonth,
    activeBookings: bookings.filter((booking) => booking.status === 'active').length,
    rating: statsResponse.data.data.average_rating_received,
  };
}

/** Ingresos por mes del año pedido, sumando la renta mensual de cada reserva. */
export async function getIncomeBalance(year: number): Promise<IncomeBalance> {
  const bookings = await getBookings('host');
  const totals = new Array(12).fill(0) as number[];

  bookings.filter(isEarning).forEach((booking) => {
    monthsCovered(booking).forEach((covered) => {
      if (covered.year === year) totals[covered.month] += monthlyAmount(booking);
    });
  });

  return { year, points: totals.map((total, monthIndex) => ({ monthIndex, total })) };
}

export async function getAvailableIncomeYears(): Promise<number[]> {
  const bookings = await getBookings('host');
  const currentYear = new Date().getFullYear();
  const years = new Set<number>([currentYear]);
  bookings.forEach((booking) => years.add(new Date(booking.start_date).getFullYear()));
  return [...years].sort((a, b) => b - a);
}

export async function getPendingRequests(): Promise<PendingRequest[]> {
  const bookings = await getBookings('host');

  return bookings
    .filter((booking) => booking.status === 'pending')
    .map((booking) => ({
      id: booking.id,
      renterName: booking.renter?.name ?? 'Inquilino',
      renterAvatarUrl: booking.renter?.avatar_url ?? null,
      spaceTitle: booking.space?.title ?? '',
      durationMonths: booking.months_duration,
      requestedAt: booking.created_at,
      totalAmount: booking.total_amount,
      platformFee: booking.platform_fee_amount,
      platformFeePercentage: booking.platform_fee_percentage,
      hostPayout: booking.host_payout_amount,
    }));
}

export type PendingRequestDecision = 'accepted' | 'rejected';

export async function decidePendingRequest(
  id: string,
  decision: PendingRequestDecision,
): Promise<{ id: string }> {
  if (decision === 'accepted') await confirmBooking(id);
  else await cancelBooking(id, 'El anfitrión rechazó la solicitud de reserva desde el panel.');
  return { id };
}

/** El anfitrión registra que ya recibió el pago de esa reserva. */
export async function confirmPaymentReceived(bookingId: string): Promise<void> {
  await confirmBookingPayment(bookingId);
}

/** "Pagos recientes": el cobro mensual de cada reserva que ya genera ingreso. */
export async function getRecentPayments(page: number, perPage = 5): Promise<Paginated<Payment>> {
  const bookings = await getBookings('host');

  const all: Payment[] = bookings
    .filter(isEarning)
    .map<Payment>((booking) => {
      const paid = booking.payment_confirmed_at !== null || booking.status === 'completed';

      return {
        id: booking.id,
        spaceTitle: booking.space?.title ?? '',
        date: booking.start_date,
        amount: monthlyAmount(booking),
        status: paid ? 'paid' : 'pending',
        // Un alquiler ya finalizado no admite confirmar cobros nuevos.
        canConfirm: !paid && booking.status !== 'completed',
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const start = (page - 1) * perPage;
  return { data: all.slice(start, start + perPage), page, perPage, total: all.length };
}
