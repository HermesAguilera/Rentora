import { getMe, normalizePhone, splitName, updateMe } from './userService';
import type {
  AppPreferences,
  NotificationPreferences,
  PasswordChangeInput,
  UserProfile,
} from '../features/configuracion/types';

const ROLE_LABEL: Record<string, string> = {
  renter: 'Inquilino',
  host: 'Anfitrión',
  both: 'Anfitrión e inquilino',
  admin: 'Administrador',
};

export async function getProfile(): Promise<UserProfile> {
  const user = await getMe();
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: ROLE_LABEL[user.role] ?? user.role,
    avatarUrl: user.avatarUrl,
  };
}

export async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  await updateMe({
    ...(patch.name ? splitName(patch.name) : {}),
    ...(patch.email ? { email: patch.email } : {}),
    ...(patch.phone ? { phone: normalizePhone(patch.phone) } : {}),
  });
  return getProfile();
}

export async function changePassword(input: PasswordChangeInput): Promise<{ success: true }> {
  await updateMe({
    current_password: input.currentPassword,
    password: input.newPassword,
    password_confirmation: input.newPassword,
  });
  return { success: true };
}

// ponytail: preferencias de notificación e idioma/moneda viven en localStorage —
// el backend no tiene tabla para ellas. Mover a la API cuando exista el endpoint.
const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  payments: { email: true, push: true },
  bookings: { email: true, push: true },
  messages: { email: true, push: false },
  account: { email: true, push: false },
};

const DEFAULT_PREFERENCES: AppPreferences = { language: 'es', currency: 'HNL' };

function read<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);
  return stored ? (JSON.parse(stored) as T) : fallback;
}

function write<T>(key: string, value: T): T {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return read('rentora.notificationPreferences', DEFAULT_NOTIFICATIONS);
}

export async function updateNotificationPreferences(
  next: NotificationPreferences,
): Promise<NotificationPreferences> {
  return write('rentora.notificationPreferences', next);
}

export async function getPreferences(): Promise<AppPreferences> {
  return read('rentora.preferences', DEFAULT_PREFERENCES);
}

export async function updatePreferences(next: AppPreferences): Promise<AppPreferences> {
  return write('rentora.preferences', next);
}
