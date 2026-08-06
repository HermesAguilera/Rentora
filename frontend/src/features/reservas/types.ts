export type BookingStatus = 'active' | 'finished';

export interface Booking {
  id: string;
  code: string;
  renterName: string;
  renterAvatarUrl: string | null;
  startDate: string;
  spaceTitle: string;
  status: BookingStatus;
}
