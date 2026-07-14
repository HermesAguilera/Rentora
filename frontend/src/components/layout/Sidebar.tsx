import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Building2,
  CalendarCheck,
  Wallet,
  MessageSquare,
  Bell,
  Settings,
} from 'lucide-react';
import logoIcon from '../../assets/images/logo-icon.png';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Resumen', icon: LayoutGrid, end: true },
  { to: '/dashboard/espacios', label: 'Mis espacios', icon: Building2, end: false },
  { to: '/dashboard/reservas', label: 'Reservas', icon: CalendarCheck, end: false },
  { to: '/dashboard/pagos', label: 'Pagos', icon: Wallet, end: false },
  { to: '/dashboard/mensajes', label: 'Mensajes', icon: MessageSquare, end: false },
  { to: '/dashboard/notificaciones', label: 'Notificaciones', icon: Bell, end: false },
  { to: '/dashboard/configuracion', label: 'Configuración', icon: Settings, end: false },
] as const;

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-8 rounded-[28px] bg-[#2b3073] px-5 py-7">
      <a href="/" className="flex items-center gap-3 px-2">
        <img src={logoIcon} alt="" className="size-9 rounded-lg" />
        <span className="font-['Quicksand',sans-serif] text-xl font-bold text-white">
          Rentora
        </span>
      </a>

      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 font-['Quicksand',sans-serif] text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-white text-[#2b3073]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="size-5" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
