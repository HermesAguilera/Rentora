import type { Booking } from '../features/reservas/types';

/**
 * Mock data layer for the "Reservas" module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

const BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    code: '#RNT-001',
    renterName: 'Carlos Ramos',
    renterAvatarUrl: null,
    startDate: '2024-07-01',
    spaceTitle: 'Bodega Palmira',
    status: 'finished',
  },
  {
    id: 'booking-2',
    code: '#RNT-002',
    renterName: 'José Martínez',
    renterAvatarUrl: null,
    startDate: '2024-06-15',
    spaceTitle: 'Garaje Lomas',
    status: 'active',
  },
  {
    id: 'booking-3',
    code: '#RNT-003',
    renterName: 'Laura Flores',
    renterAvatarUrl: null,
    startDate: '2025-01-01',
    spaceTitle: 'Bodega Miraflores',
    status: 'active',
  },
  {
    id: 'booking-4',
    code: '#RNT-004',
    renterName: 'Ana Suazo',
    renterAvatarUrl: null,
    startDate: '2024-05-10',
    spaceTitle: 'Bodega Res. Honduras',
    status: 'finished',
  },
];

export function getBookings(): Promise<Booking[]> {
  return delay([...BOOKINGS]);
}
