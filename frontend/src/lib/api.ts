import axios from 'axios';
import type { AxiosError } from 'axios';
import { useAuthStore } from './authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Un 401 significa token vencido o revocado: limpiamos la sesión y volvemos al login.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !location.pathname.startsWith('/login')) {
      useAuthStore.getState().clear();
      location.assign('/login');
    }
    return Promise.reject(error);
  },
);

/** Mensaje legible de un error de la API (Laravel manda `message` y a veces `errors`). */
export function apiMessage(error: unknown, fallback = 'Ocurrió un error. Intenta de nuevo.'): string {
  const data = (error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>)
    ?.response?.data;
  if (!data) return fallback;
  const firstFieldError = data.errors && Object.values(data.errors)[0]?.[0];
  return firstFieldError ?? data.message ?? fallback;
}
