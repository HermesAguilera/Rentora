import { Link, NavLink } from 'react-router-dom';
import { Bell, Heart, Home, MessageSquare, Plus, Ticket, User } from 'lucide-react';
import logoIcon from '../../assets/images/logo-icon.png';

const NAV_ITEMS = [
  { to: '/app', label: 'Inicio', icon: Home, end: true, badge: 0 },
  { to: '/app/reservas', label: 'Reservas', icon: Ticket, end: false, badge: 0 },
  { to: '/app/favoritos', label: 'Favoritos', icon: Heart, end: false, badge: 0 },
  { to: '/app/mensajes', label: 'Mensajes', icon: MessageSquare, end: false, badge: 3 },
  { to: '/app/notificaciones', label: 'Notificaciones', icon: Bell, end: false, badge: 3 },
] as const;

export default function ClientNavbar() {
  return (
    <header className="flex items-center justify-between bg-white px-10 py-[30px]">
      <Link to="/app" className="flex items-center gap-3">
        <img src={logoIcon} alt="" className="size-9 rounded-lg" />
        <span className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
          Rentora
        </span>
      </Link>

      <nav className="flex items-center gap-1" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-2 rounded-full px-4 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#2b3073] text-white'
                  : 'text-[#8b899e] hover:bg-[#f4f5fc] hover:text-[#2b3073]'
              }`
            }
          >
            <Icon className="size-4" strokeWidth={2} />
            {label}
            {badge > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#e5484d] text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/app/publicar"
          className="flex items-center gap-2 rounded-full bg-[#4d44b5] px-5 py-2.5 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" strokeWidth={2.5} />
          Publicar espacio
        </Link>
        <Link
          to="/app/perfil"
          aria-label="Mi perfil"
          className="flex size-10 items-center justify-center rounded-full bg-[#f4f5fc] text-[#2b3073] transition-colors hover:bg-[#e7e8f2]"
        >
          <User className="size-4" strokeWidth={2} />
        </Link>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full bg-[#f4f5fc] font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]"
        >
          ES
        </button>
      </div>
    </header>
  );
}
