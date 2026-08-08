import {
  LayoutGrid,
  Building2,
  CalendarCheck,
  Compass,
  MessageSquare,
  Bell,
  Settings,
  Users,
} from 'lucide-react';
import type { NavItem } from './Sidebar';

/** Vuelve a la app de inquilino, donde se ven los espacios de todos. */
export const EXPLORE_LINK: NavItem = {
  to: '/app',
  label: 'Explorar espacios',
  icon: Compass,
  end: false,
};

export const HOST_NAV: readonly NavItem[] = [
  { to: '/dashboard', label: 'Resumen', icon: LayoutGrid, end: true },
  { to: '/dashboard/espacios', label: 'Mis espacios', icon: Building2, end: false },
  { to: '/dashboard/reservas', label: 'Reservas', icon: CalendarCheck, end: false },
  { to: '/dashboard/mensajes', label: 'Mensajes', icon: MessageSquare, end: false },
  { to: '/dashboard/notificaciones', label: 'Notificaciones', icon: Bell, end: false },
  { to: '/dashboard/configuracion', label: 'Configuración', icon: Settings, end: false },
];

export const HOST_TITLES: Record<string, string> = {
  '/dashboard': 'Resumen',
  '/dashboard/espacios': 'Mis espacios',
  '/dashboard/reservas': 'Reservas',
  '/dashboard/mensajes': 'Mensajes',
  '/dashboard/notificaciones': 'Notificaciones',
  '/dashboard/configuracion': 'Configuración',
};

export const ADMIN_NAV: readonly NavItem[] = [
  { to: '/admin', label: 'Resumen', icon: LayoutGrid, end: true },
  { to: '/admin/espacios', label: 'Moderar espacios', icon: Building2, end: false },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, end: false },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings, end: false },
];

export const ADMIN_TITLES: Record<string, string> = {
  '/admin': 'Resumen de la plataforma',
  '/admin/espacios': 'Moderación de espacios',
  '/admin/usuarios': 'Gestión de usuarios',
  '/admin/configuracion': 'Configuración',
};
