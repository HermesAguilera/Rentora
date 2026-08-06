import type {
  ContractSummary,
  PaymentConfirmation,
  PaymentHistoryItem,
  PaymentMethod,
} from '../features/cliente/reservas/types';
import { getSpace } from './clienteEspaciosService';

/**
 * Mock data layer for the client-facing "Reservas" module and the
 * contract-signing / checkout flow that follows a booking.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

const PAYMENT_HISTORY: PaymentHistoryItem[] = [
  {
    id: 'payment-1',
    spaceTitle: 'Bodega Amalia',
    date: '2026-07-05',
    paymentMethod: 'Visa •••• 4521',
    amount: 2500,
    status: 'paid',
  },
  {
    id: 'payment-2',
    spaceTitle: 'Bodega Amalia',
    date: '2026-06-05',
    paymentMethod: 'Visa •••• 4521',
    amount: 2500,
    status: 'paid',
  },
  {
    id: 'payment-3',
    spaceTitle: 'Bodega Amalia',
    date: '2026-05-05',
    paymentMethod: 'Visa •••• 4521',
    amount: 2500,
    status: 'paid',
  },
  {
    id: 'payment-4',
    spaceTitle: 'Cuarto exterior Miraflores',
    date: '2026-04-04',
    paymentMethod: 'Transferencia BAC',
    amount: 1800,
    status: 'paid',
  },
  {
    id: 'payment-5',
    spaceTitle: 'Garaje Los Próceres',
    date: '2026-04-30',
    paymentMethod: 'Visa •••• 4521',
    amount: 950,
    status: 'pending',
  },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'method-visa-4521', label: 'Visa terminada en 4521', isDefault: true },
  { id: 'method-bac-9032', label: 'Transferencia BAC 9032', isDefault: false },
];

export function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  return delay([...PAYMENT_HISTORY]);
}

export async function getContractSummary(spaceId: string): Promise<ContractSummary | null> {
  const space = await getSpace(spaceId);
  if (!space) return null;
  return delay({
    spaceId: space.id,
    spaceTitle: `${space.title} · ${space.location}`,
    ownerName: space.ownerName,
    durationLabel: '1 año',
    monthlyPayment: space.pricePerMonth,
  });
}

export function signContract(_spaceId: string): Promise<{ success: true }> {
  return delay({ success: true });
}

export function getPaymentMethods(): Promise<PaymentMethod[]> {
  return delay([...PAYMENT_METHODS]);
}

export async function confirmPayment(
  spaceId: string,
  paymentMethodId: string,
): Promise<PaymentConfirmation | null> {
  const space = await getSpace(spaceId);
  const method = PAYMENT_METHODS.find((item) => item.id === paymentMethodId);
  if (!space || !method) return null;
  return delay({
    spaceTitle: `${space.title} · ${space.location}`,
    amount: space.pricePerMonth,
    paymentMethodLabel: method.label,
    date: new Date().toISOString(),
  });
}
