import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../../services/reservasService';

const reservasKeys = {
  bookings: ['reservas', 'bookings'] as const,
};

export function useBookings() {
  return useQuery({
    queryKey: reservasKeys.bookings,
    queryFn: getBookings,
  });
}
