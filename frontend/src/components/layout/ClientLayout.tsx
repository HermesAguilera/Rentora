import { Outlet, useLocation } from 'react-router-dom';
import ClientNavbar from './ClientNavbar';
import BackButton from '../shared/BackButton';

export default function ClientLayout() {
  const { pathname } = useLocation();

  // Inicio es la raíz de esta sección: no hay a dónde regresar.
  const isHome = pathname === '/app';

  return (
    <div className="min-h-screen bg-[#f4f5fc]">
      <ClientNavbar />
      <main className="mx-auto flex max-w-[1840px] flex-col gap-6 px-10 py-8">
        {!isHome && <BackButton fallback="/app" />}
        <Outlet />
      </main>
    </div>
  );
}
