/**
 * Mock data layer for authentication.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

export interface LoginInput {
  email: string;
  password: string;
}

export function login(_input: LoginInput): Promise<{ success: true }> {
  return delay({ success: true });
}

export interface RegisterInput {
  email: string;
  phone: string;
  username: string;
  password: string;
}

export function register(_input: RegisterInput): Promise<{ success: true }> {
  return delay({ success: true });
}
