import { api } from '../lib/api';
import type { AdminSpace, AdminStats, AdminUser } from '../features/admin/types';
import type { SpaceCategory } from '../features/cliente/espacios/types';
import type { SpaceStatus } from '../features/espacios/types';

/** Los endpoints de admin devuelven el paginador crudo de Eloquent. */
interface ApiAdminSpace {
  uuid: string;
  title: string;
  description: string;
  type: SpaceCategory;
  status: SpaceStatus;
  price_per_month: string;
  address_line: string;
  neighborhood: string | null;
  city: string;
  created_at: string;
  host: { uuid: string; full_name: string; email: string };
}

interface ApiAdminUser {
  uuid: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: AdminUser['role'];
  status: AdminUser['status'];
  identity_verified_at: string | null;
  created_at: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<{
    users: { total: number; active: number; new_this_month: number };
    spaces: { total: number; active: number; pending_review: number };
    bookings: { total: number; active: number; completed_this_month: number };
    revenue: { total_platform_fees: number; this_month: number };
  }>('/admin/stats');

  return {
    users: data.users,
    spaces: data.spaces,
    bookings: data.bookings,
    revenue: {
      totalPlatformFees: Number(data.revenue.total_platform_fees),
      thisMonth: Number(data.revenue.this_month),
    },
  };
}

export async function getAdminSpaces(status?: SpaceStatus): Promise<AdminSpace[]> {
  const { data } = await api.get<{ data: ApiAdminSpace[] }>('/admin/spaces', {
    params: { ...(status ? { status } : {}), per_page: 50 },
  });

  return data.data.map((space) => ({
    id: space.uuid,
    title: space.title,
    description: space.description,
    category: space.type,
    status: space.status,
    pricePerMonth: Number(space.price_per_month),
    address: [space.address_line, space.neighborhood, space.city].filter(Boolean).join(', '),
    hostName: space.host?.full_name ?? '—',
    hostEmail: space.host?.email ?? '',
    createdAt: space.created_at,
  }));
}

export async function approveSpace(id: string): Promise<void> {
  await api.post(`/admin/spaces/${id}/approve`);
}

export async function rejectSpace(id: string, reason: string): Promise<void> {
  await api.post(`/admin/spaces/${id}/reject`, { rejection_reason: reason });
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<{ data: ApiAdminUser[] }>('/admin/users', {
    params: { per_page: 50 },
  });

  return data.data.map((user) => ({
    id: user.uuid,
    name: user.full_name,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role,
    status: user.status,
    identityVerified: user.identity_verified_at !== null,
    createdAt: user.created_at,
  }));
}

export type UserAction = 'suspend' | 'reactivate' | 'ban' | 'verify-identity';

export async function applyUserAction(
  id: string,
  action: UserAction,
  reason?: string,
): Promise<void> {
  // suspender y banear exigen motivo en el backend.
  const body = action === 'suspend' || action === 'ban' ? { reason } : undefined;
  await api.post(`/admin/users/${id}/${action}`, body);
}
