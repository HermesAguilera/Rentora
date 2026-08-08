import { createBooking, getBookings } from './bookingsApi';
import { getSpace } from './clienteEspaciosService';
import type {
  ContractSummary,
  PaymentConfirmation,
  PaymentHistoryItem,
  PaymentMethod,
} from '../features/cliente/reservas/types';
import type { BookingStatus } from '../features/reservas/types';

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Pendiente de confirmación',
  confirmed: 'Confirmada',
  active: 'Activa',
  completed: 'Finalizada',
  disputed: 'En disputa',
  cancelled_by_renter: 'Cancelada por ti',
  cancelled_by_host: 'Cancelada por el anfitrión',
};

export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  const bookings = await getBookings('renter');

  return bookings.map((booking) => ({
    id: booking.id,
    spaceTitle: booking.space?.title ?? 'Espacio',
    date: booking.start_date,
    detail: `${booking.months_duration} mes(es) · ${STATUS_LABEL[booking.status]}`,
    amount: booking.total_amount,
    status:
      booking.payment_confirmed_at !== null || booking.status === 'completed'
        ? 'paid'
        : 'pending',
  }));
}

export async function getContractSummary(spaceId: string): Promise<ContractSummary | null> {
  const space = await getSpace(spaceId);
  if (!space) return null;

  return {
    spaceId: space.id,
    spaceTitle: `${space.title} · ${space.location}`,
    ownerName: space.ownerName,
    monthlyPayment: space.pricePerMonth,
  };
}

/** Firmar el contrato es lo que crea la reserva: queda pendiente de que el anfitrión la confirme. */
export async function signContract(
  spaceId: string,
  startDate: string,
  months: number,
): Promise<{ bookingId: string }> {
  const booking = await createBooking(spaceId, startDate, months);
  return { bookingId: booking.id };
}

// ponytail: Rentora todavía no procesa pagos (FEATURE_PAYMENTS_ENABLED=false en el backend).
// Estos métodos son opciones de pago acordadas fuera de la plataforma; cuando exista la
// pasarela, reemplazar por `GET /me/payment-methods`.
const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', label: 'Efectivo al anfitrión', isDefault: true },
  { id: 'transfer', label: 'Transferencia bancaria', isDefault: false },
];

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return PAYMENT_METHODS;
}

export async function confirmPayment(
  spaceId: string,
  paymentMethodId: string,
): Promise<PaymentConfirmation | null> {
  const space = await getSpace(spaceId);
  const method = PAYMENT_METHODS.find((item) => item.id === paymentMethodId);
  if (!space || !method) return null;

  return {
    spaceTitle: `${space.title} · ${space.location}`,
    amount: space.pricePerMonth,
    paymentMethodLabel: method.label,
    date: new Date().toISOString(),
  };
}
