import type {
  AppPreferences,
  NotificationPreferences,
  PasswordChangeInput,
  UserProfile,
} from '../features/configuracion/types';

/**
 * Mock data layer for the "Configuración" module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

let profile: UserProfile = {
  name: 'Nabila A.',
  email: 'nabila.admin@rentora.hn',
  phone: '+504 9999-0000',
  role: 'Administrador',
  avatarUrl: null,
};

let notificationPreferences: NotificationPreferences = {
  payments: { email: true, push: true },
  bookings: { email: true, push: true },
  messages: { email: true, push: false },
  account: { email: true, push: false },
};

let preferences: AppPreferences = {
  language: 'es',
  currency: 'HNL',
};

export function getProfile(): Promise<UserProfile> {
  return delay({ ...profile });
}

export function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  profile = { ...profile, ...patch };
  return delay({ ...profile });
}

export function getNotificationPreferences(): Promise<NotificationPreferences> {
  return delay(structuredClone(notificationPreferences));
}

export function updateNotificationPreferences(
  next: NotificationPreferences,
): Promise<NotificationPreferences> {
  notificationPreferences = next;
  return delay(structuredClone(notificationPreferences));
}

export function getPreferences(): Promise<AppPreferences> {
  return delay({ ...preferences });
}

export function updatePreferences(next: AppPreferences): Promise<AppPreferences> {
  preferences = next;
  return delay({ ...preferences });
}

export function changePassword(_input: PasswordChangeInput): Promise<{ success: true }> {
  return delay({ success: true });
}
