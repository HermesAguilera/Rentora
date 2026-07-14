import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Resumen',
  '/dashboard/espacios': 'Mis espacios',
  '/dashboard/reservas': 'Reservas',
  '/dashboard/pagos': 'Pagos',
  '/dashboard/mensajes': 'Mensajes',
  '/dashboard/notificaciones': 'Notificaciones',
  '/dashboard/configuracion': 'Configuración',
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Resumen';

  return (
    <div className="flex min-h-screen gap-4 bg-[#f4f5fc] p-4">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">{title}</p>
        <Topbar title={title} />
        <main className="flex flex-1 flex-col gap-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
