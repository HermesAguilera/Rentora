import { Outlet } from 'react-router-dom';
import ClientNavbar from './ClientNavbar';

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-[#f4f5fc]">
      <ClientNavbar />
      <main className="mx-auto flex max-w-[1840px] flex-col gap-6 px-10 py-8">
        <Outlet />
      </main>
    </div>
  );
}
