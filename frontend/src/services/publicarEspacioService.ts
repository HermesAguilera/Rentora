import type { NewSpaceInput } from '../features/cliente/publicar/types';

/**
 * Mock data layer for the "Publicar espacio" (list a new space) module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

export function publishSpace(_input: NewSpaceInput): Promise<{ id: string }> {
  return delay({ id: `space-${Date.now()}` });
}
