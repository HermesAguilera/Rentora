import { api } from '../lib/api';

export interface PublicStats {
  activeSpaces: number;
  registeredUsers: number;
  completedBookings: number;
  averageRating: number;
  /** Comisión que Rentora retiene de cada reserva. */
  platformFeePercentage: number;
}

export async function getPublicStats(): Promise<PublicStats> {
  const { data } = await api.get<{
    data: {
      active_spaces: number;
      registered_users: number;
      completed_bookings: number;
      average_rating: number;
      platform_fee_percentage: number;
    };
  }>('/stats');

  return {
    activeSpaces: data.data.active_spaces,
    registeredUsers: data.data.registered_users,
    completedBookings: data.data.completed_bookings,
    averageRating: data.data.average_rating,
    platformFeePercentage: data.data.platform_fee_percentage,
  };
}
