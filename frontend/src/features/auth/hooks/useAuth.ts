import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  login,
  logout,
  logoutAllDevices,
  register,
  requestPasswordReset,
} from '../../../services/authService';
import type { LoginInput, RegisterInput } from '../../../services/authService';
import { acceptTerms } from '../../../services/userService';
import { useAuthStore } from '../../../lib/authStore';
import type { AuthUser } from '../../../lib/authStore';

/** Ruta inicial según el rol devuelto por la API. */
export function homePathFor(user: AuthUser): string {
  return user.role === 'admin' ? '/admin' : '/app';
}

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
}

export function useLogoutAllDevices() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAllDevices,
    onSettled: () => {
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
}

export function useAcceptTerms() {
  return useMutation({
    mutationFn: acceptTerms,
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  });
}

export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}
