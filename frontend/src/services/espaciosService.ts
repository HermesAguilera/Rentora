import type { Space } from '../features/espacios/types';

/**
 * Mock data layer for the "Mis espacios" module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

const SPACES: Space[] = [
  {
    id: 'space-1',
    name: 'Bodega Col. Palmira',
    imageUrl: null,
    location: 'Tegucigalpa',
    sizeM2: 40,
    status: 'active',
    pricePerMonth: 2500,
    phone: '+504 9999-0001',
    email: 'contacto@bodegapalmira.hn',
  },
  {
    id: 'space-2',
    name: 'Garaje Lomas del Guijarro',
    imageUrl: null,
    location: 'Tegucigalpa',
    sizeM2: 20,
    status: 'active',
    pricePerMonth: 800,
    phone: '+504 9999-0002',
    email: 'contacto@garajelomas.hn',
  },
  {
    id: 'space-3',
    name: 'Bodega Miraflores',
    imageUrl: null,
    location: 'Tegucigalpa',
    sizeM2: 15,
    status: 'active',
    pricePerMonth: 1800,
    phone: '+504 9999-0003',
    email: 'contacto@bodegamiraflores.hn',
  },
  {
    id: 'space-4',
    name: 'Bodega Res. Honduras',
    imageUrl: null,
    location: 'Tegucigalpa',
    sizeM2: 30,
    status: 'paused',
    pricePerMonth: 3200,
    phone: '+504 9999-0004',
    email: 'contacto@bodegareshn.hn',
  },
];

export function getSpaces(): Promise<Space[]> {
  return delay([...SPACES]);
}
