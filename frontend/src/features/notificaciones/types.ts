export type NotificationCategory = 'payment' | 'booking' | 'message' | 'verification' | 'space';

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  date: string;
  read: boolean;
  /** Pantalla a la que lleva al hacer clic; null si no aplica. */
  url: string | null;
}
