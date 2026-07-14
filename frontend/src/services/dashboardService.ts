import type {
  DashboardSummary,
  IncomeBalance,
  Paginated,
  PendingRequest,
  Payment,
} from '../features/dashboard/types';

/**
 * Mock data layer for the host "Resumen" dashboard.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

const SUMMARY: DashboardSummary = {
  publishedSpaces: 2,
  incomeThisMonth: 14200,
  activeBookings: 7,
  rating: 4.8,
};

const INCOME_BY_YEAR: Record<number, number[]> = {
  2025: [8500, 12000, 15500, 11000, 9000, 13500, 19345, 14000, 10500, 16000, 21000, 17500],
  2024: [6200, 9800, 12100, 8700, 7300, 10600, 15200, 11400, 8200, 12800, 16700, 13900],
  2023: [4100, 6900, 8300, 6100, 5000, 7400, 10600, 7900, 5700, 8900, 11500, 9600],
};

const PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 'req-1',
    renterName: 'María López',
    renterAvatarUrl: null,
    spaceTitle: 'Bodega Palmira',
    durationMonths: 3,
    requestedAt: '2026-07-10T14:00:00Z',
  },
  {
    id: 'req-2',
    renterName: 'Tony Gómez',
    renterAvatarUrl: null,
    spaceTitle: 'Bodega Palmira',
    durationMonths: 24,
    requestedAt: '2026-07-09T09:30:00Z',
  },
  {
    id: 'req-3',
    renterName: 'Josué Canales',
    renterAvatarUrl: null,
    spaceTitle: 'Bodega Palmira',
    durationMonths: 8,
    requestedAt: '2026-07-08T18:15:00Z',
  },
];

const ALL_PAYMENTS: Payment[] = [
  { id: 'pay-1', spaceTitle: 'Bodega Palmira', date: '2026-03-03', amount: 2500, status: 'paid' },
  { id: 'pay-2', spaceTitle: 'Bodega Miraflores', date: '2026-03-15', amount: 1800, status: 'paid' },
  { id: 'pay-3', spaceTitle: 'Garaje Lomas', date: '2026-03-20', amount: 800, status: 'paid' },
  { id: 'pay-4', spaceTitle: 'Bodega Palmira', date: '2026-04-04', amount: 2500, status: 'paid' },
  { id: 'pay-5', spaceTitle: 'Bodega Miraflores', date: '2026-04-15', amount: 1800, status: 'paid' },
  { id: 'pay-6', spaceTitle: 'Garaje Lomas', date: '2026-03-30', amount: 800, status: 'pending' },
  { id: 'pay-7', spaceTitle: 'Bodega Palmira', date: '2026-05-04', amount: 2500, status: 'paid' },
  { id: 'pay-8', spaceTitle: 'Bodega Miraflores', date: '2026-05-16', amount: 1800, status: 'pending' },
  { id: 'pay-9', spaceTitle: 'Garaje Lomas', date: '2026-05-28', amount: 800, status: 'paid' },
  { id: 'pay-10', spaceTitle: 'Bodega Palmira', date: '2026-06-05', amount: 2500, status: 'paid' },
  { id: 'pay-11', spaceTitle: 'Bodega Miraflores', date: '2026-06-15', amount: 1800, status: 'paid' },
  { id: 'pay-12', spaceTitle: 'Garaje Lomas', date: '2026-06-27', amount: 800, status: 'pending' },
  { id: 'pay-13', spaceTitle: 'Bodega Palmira', date: '2026-07-05', amount: 2500, status: 'paid' },
];

export function getDashboardSummary(): Promise<DashboardSummary> {
  return delay(SUMMARY);
}

export function getIncomeBalance(year: number): Promise<IncomeBalance> {
  const amounts = INCOME_BY_YEAR[year] ?? INCOME_BY_YEAR[2025];
  return delay({
    year,
    points: amounts.map((total, monthIndex) => ({ monthIndex, total })),
  });
}

export function getAvailableIncomeYears(): Promise<number[]> {
  return delay(Object.keys(INCOME_BY_YEAR).map(Number).sort((a, b) => b - a));
}

export function getPendingRequests(): Promise<PendingRequest[]> {
  return delay([...PENDING_REQUESTS]);
}

export type PendingRequestDecision = 'accepted' | 'rejected';

export function decidePendingRequest(
  _id: string,
  _decision: PendingRequestDecision,
): Promise<{ id: string }> {
  return delay({ id: _id });
}

export function getRecentPayments(page: number, perPage = 5): Promise<Paginated<Payment>> {
  const start = (page - 1) * perPage;
  const data = ALL_PAYMENTS.slice(start, start + perPage);
  return delay({ data, page, perPage, total: ALL_PAYMENTS.length });
}
