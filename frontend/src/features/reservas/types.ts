/** Espeja `App\Enums\BookingStatus` del backend. */
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'disputed'
  | 'cancelled_by_renter'
  | 'cancelled_by_host';

export interface Booking {
  id: string;
  code: string;
  renterName: string;
  renterAvatarUrl: string | null;
  startDate: string;
  spaceTitle: string;
  status: BookingStatus;
}
