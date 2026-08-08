import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'renter' | 'host' | 'both' | 'admin';
  avatarUrl: string | null;
  memberSince: string;
  isVerified: boolean;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: null, user: null }),
    }),
    { name: 'rentora.auth' },
  ),
);

/** Shape que devuelve `UserPrivateResource` del backend. */
export interface ApiUser {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: AuthUser['role'];
  avatar_url: string | null;
  created_at: string;
  is_verified: boolean;
}

export function toAuthUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role,
    avatarUrl: user.avatar_url,
    memberSince: user.created_at,
    isVerified: user.is_verified,
  };
}
