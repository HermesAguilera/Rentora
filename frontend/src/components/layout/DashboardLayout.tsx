import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { EXPLORE_LINK, HOST_NAV, HOST_TITLES } from './navConfig';
import type { NavItem } from './Sidebar';

interface DashboardLayoutProps {
  items?: readonly NavItem[];
  titles?: Record<string, string>;
  /** Se muestra bajo el logo, p. ej. "Administración". */
  subtitle?: string;
}

export default function DashboardLayout({
  items = HOST_NAV,
  titles = HOST_TITLES,
  subtitle,
}: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? Object.values(titles)[0];

  // La primera entrada del menú es la raíz del panel: ahí no hace falta regresar.
  const root = items[0].to;
  const isRoot = pathname === root;

  return (
    <div className="flex min-h-screen gap-4 bg-[#f4f5fc] p-4">
      <Sidebar items={items} subtitle={subtitle} footerItem={EXPLORE_LINK} />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">{title}</p>
        <Topbar title={title} backTo={isRoot ? undefined : root} />
        <main className="flex flex-1 flex-col gap-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
