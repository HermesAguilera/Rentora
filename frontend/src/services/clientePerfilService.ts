import type { ClientProfile } from '../features/cliente/perfil/types';

/**
 * Mock data layer for the client-facing "Perfil" module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

let profile: ClientProfile = {
  name: 'Erick Sánchez',
  email: 'erick.sanchez@correo.com',
  phone: '+504 98/76-5432',
  city: 'Tegucigalpa',
  avatarUrl: null,
  memberSince: '2024-02-01',
  rating: 4.9,
  reviewsCount: 25,
  spacesCount: 2,
  reservationsCount: 1,
};

export function getClientProfile(): Promise<ClientProfile> {
  return delay({ ...profile });
}

export function updateClientProfile(patch: Partial<ClientProfile>): Promise<ClientProfile> {
  profile = { ...profile, ...patch };
  return delay({ ...profile });
}
