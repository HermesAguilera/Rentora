import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changePassword,
  getNotificationPreferences,
  getPreferences,
  getProfile,
  updateNotificationPreferences,
  updatePreferences,
  updateProfile,
} from '../../../services/configuracionService';
import type {
  AppPreferences,
  NotificationPreferences,
  PasswordChangeInput,
  UserProfile,
} from '../types';

const configuracionKeys = {
  profile: ['configuracion', 'profile'] as const,
  notificationPreferences: ['configuracion', 'notification-preferences'] as const,
  preferences: ['configuracion', 'preferences'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: configuracionKeys.profile,
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<UserProfile>) => updateProfile(patch),
    onSuccess: (next) => {
      queryClient.setQueryData(configuracionKeys.profile, next);
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: configuracionKeys.notificationPreferences,
    queryFn: getNotificationPreferences,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (next: NotificationPreferences) => updateNotificationPreferences(next),
    onSuccess: (next) => {
      queryClient.setQueryData(configuracionKeys.notificationPreferences, next);
    },
  });
}

export function usePreferences() {
  return useQuery({
    queryKey: configuracionKeys.preferences,
    queryFn: getPreferences,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (next: AppPreferences) => updatePreferences(next),
    onSuccess: (next) => {
      queryClient.setQueryData(configuracionKeys.preferences, next);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: PasswordChangeInput) => changePassword(input),
  });
}
