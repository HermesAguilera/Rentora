export type NotificationCategory = 'payment' | 'booking' | 'message' | 'verification';

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  date: string;
  read: boolean;
}
