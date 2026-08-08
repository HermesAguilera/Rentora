import { api } from '../lib/api';
import { toAuthUser, useAuthStore } from '../lib/authStore';
import type { ApiUser, AuthUser } from '../lib/authStore';

export interface UserStats {
  total_renter_bookings: number;
  total_host_bookings: number;
  average_rating_received: number;
  total_reviews_received: number;
  total_spaces_listed: number;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<{ data: ApiUser }>('/users/me');
  const user = toAuthUser(data.data);
  useAuthStore.getState().setUser(user);
  return user;
}

/** Registra la aceptación de los términos en el perfil del usuario. */
export async function acceptTerms(): Promise<void> {
  await api.post('/users/me/accept-terms');
}

export async function getMyStats(): Promise<UserStats> {
  const { data } = await api.get<{ data: UserStats }>('/users/me/stats');
  return data.data;
}

/**
 * El backend valida el teléfono con `/^(?:\+504|00504)?[2389]\d{7}$/`, sin espacios
 * ni guiones, así que limpiamos lo que escriba el usuario antes de enviarlo.
 */
export function normalizePhone(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length > 0 ? cleaned : null;
}

/** El backend guarda nombre y apellido por separado. */
export function splitName(fullName: string): { first_name: string; last_name: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    first_name: parts[0] ?? '',
    last_name: parts.slice(1).join(' ') || parts[0] || '',
  };
}

export async function updateMe(patch: Record<string, unknown>): Promise<AuthUser> {
  const { data } = await api.patch<{ data: ApiUser }>('/users/me', patch);
  const user = toAuthUser(data.data);
  useAuthStore.getState().setUser(user);
  return user;
}
