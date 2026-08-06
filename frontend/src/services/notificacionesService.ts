import type { Notification } from '../features/notificaciones/types';

/**
 * Mock data layer for the "Notificaciones" module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 'notification-1',
    category: 'payment',
    title: 'Pago próximo a vencer',
    description: 'Bodega Col. Palmira · L. 2,500',
    date: '2024-07-21',
    read: false,
  },
  {
    id: 'notification-2',
    category: 'booking',
    title: 'Solicitud aceptada',
    description: 'Garaje Los Próceres · Diego Flores aceptó tu solicitud',
    date: '2024-07-20',
    read: false,
  },
  {
    id: 'notification-3',
    category: 'message',
    title: 'Carlos Mesías te escribió',
    description: 'Hola Erick, ¿todavía tienes espacio disponible?',
    date: '2024-07-21',
    read: false,
  },
  {
    id: 'notification-4',
    category: 'verification',
    title: 'Perfil verificado',
    description: 'Tu identidad fue verificada exitosamente',
    date: '2024-07-15',
    read: false,
  },
];

export function getNotifications(): Promise<Notification[]> {
  return delay([...NOTIFICATIONS]);
}
