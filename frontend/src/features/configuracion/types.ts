export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string | null;
}

export type NotificationTopic = 'payments' | 'bookings' | 'messages' | 'account';
export type NotificationChannel = 'email' | 'push';

export type NotificationPreferences = Record<NotificationTopic, Record<NotificationChannel, boolean>>;

export type Language = 'es' | 'en';
export type Currency = 'HNL' | 'USD';

export interface AppPreferences {
  language: Language;
  currency: Currency;
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}
