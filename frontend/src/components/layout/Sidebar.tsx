import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import logoIcon from '../../assets/images/logo-icon.png';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end: boolean;
}

interface SidebarProps {
  items: readonly NavItem[];
  /** Se muestra bajo el logo, p. ej. "Administración". */
  subtitle?: string;
  /** Enlace separado al pie, para salir de este panel. */
  footerItem?: NavItem;
}

export default function Sidebar({ items, subtitle, footerItem }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-8 rounded-[28px] bg-[#2b3073] px-5 py-7">
      <a href="/" className="flex items-center gap-3 px-2">
        <img src={logoIcon} alt="" className="size-9 rounded-lg" />
        <span className="flex flex-col leading-tight">
          <span className="font-['Quicksand',sans-serif] text-xl font-bold text-white">
            Rentora
          </span>
          {subtitle && (
            <span className="font-['Quicksand',sans-serif] text-xs font-semibold text-white/60">
              {subtitle}
            </span>
          )}
        </span>
      </a>

      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Navegación principal">
        {items.map(({ to, label, icon: Icon, end }) => (
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

      {footerItem && (
        <NavLink
          to={footerItem.to}
          className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 font-['Quicksand',sans-serif] text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <footerItem.icon className="size-5" strokeWidth={2} />
          {footerItem.label}
        </NavLink>
      )}
    </aside>
  );
}
