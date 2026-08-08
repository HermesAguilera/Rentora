import { api } from '../lib/api';
import { toAuthUser, useAuthStore } from '../lib/authStore';
import { normalizePhone } from './userService';
import type { ApiUser, AuthUser } from '../lib/authStore';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

interface AuthResponse {
  user: ApiUser;
  token: string;
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const { data } = await api.post<AuthResponse>('/auth/login', input);
  const user = toAuthUser(data.user);
  useAuthStore.getState().setSession(data.token, user);
  return user;
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: normalizePhone(input.phone),
    password: input.password,
    password_confirmation: input.passwordConfirmation,
    // "both" deja al usuario publicar espacios y reservar sin registrarse dos veces.
    intended_role: 'both',
  });
  const user = toAuthUser(data.user);
  useAuthStore.getState().setSession(data.token, user);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    useAuthStore.getState().clear();
  }
}

/** Revoca todos los tokens del usuario, no solo el de esta sesión. */
export async function logoutAllDevices(): Promise<void> {
  try {
    await api.post('/auth/logout-all');
  } finally {
    useAuthStore.getState().clear();
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}
