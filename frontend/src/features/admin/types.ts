import type { SpaceCategory } from '../cliente/espacios/types';
import type { SpaceStatus } from '../espacios/types';

export interface AdminStats {
  users: { total: number; active: number; new_this_month: number };
  spaces: { total: number; active: number; pending_review: number };
  bookings: { total: number; active: number; completed_this_month: number };
  revenue: { totalPlatformFees: number; thisMonth: number };
}

export interface AdminSpace {
  id: string;
  title: string;
  description: string;
  category: SpaceCategory;
  status: SpaceStatus;
  pricePerMonth: number;
  address: string;
  hostName: string;
  hostEmail: string;
  createdAt: string;
}

/** Espeja `App\Enums\UserRole` y `App\Enums\UserStatus`. */
export type AdminUserRole = 'renter' | 'host' | 'both' | 'admin';
export type AdminUserStatus = 'pending_verification' | 'active' | 'suspended' | 'banned';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  identityVerified: boolean;
  createdAt: string;
}
