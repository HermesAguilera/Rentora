import { getMe, getMyStats, normalizePhone, splitName, updateMe } from './userService';
import type { ClientProfile } from '../features/cliente/perfil/types';

export async function getClientProfile(): Promise<ClientProfile> {
  const [user, stats] = await Promise.all([getMe(), getMyStats()]);

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    memberSince: user.memberSince,
    rating: stats.average_rating_received,
    reviewsCount: stats.total_reviews_received,
    spacesCount: stats.total_spaces_listed,
    reservationsCount: stats.total_renter_bookings,
  };
}

export async function updateClientProfile(patch: Partial<ClientProfile>): Promise<ClientProfile> {
  await updateMe({
    ...(patch.name ? splitName(patch.name) : {}),
    ...(patch.email ? { email: patch.email } : {}),
    ...(patch.phone ? { phone: normalizePhone(patch.phone) } : {}),
  });
  return getClientProfile();
}
