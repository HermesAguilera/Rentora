import { useMutation } from '@tanstack/react-query';
import { login, register } from '../../../services/authService';
import type { LoginInput, RegisterInput } from '../../../services/authService';

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
