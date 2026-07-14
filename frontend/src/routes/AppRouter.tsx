import { Navigate, Route, Routes } from 'react-router-dom';
import { Building2, CalendarCheck, MessageSquare, Bell, Settings, Wallet } from 'lucide-react';
import LandingPage from '../features/landing/LandingPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardPage from '../features/dashboard/DashboardPage';
import ComingSoon from '../components/shared/ComingSoon';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="espacios"
          element={<ComingSoon title="Mis espacios" icon={Building2} />}
        />
        <Route path="reservas" element={<ComingSoon title="Reservas" icon={CalendarCheck} />} />
        <Route path="pagos" element={<ComingSoon title="Pagos" icon={Wallet} />} />
        <Route path="mensajes" element={<ComingSoon title="Mensajes" icon={MessageSquare} />} />
        <Route
          path="notificaciones"
          element={<ComingSoon title="Notificaciones" icon={Bell} />}
        />
        <Route
          path="configuracion"
          element={<ComingSoon title="Configuración" icon={Settings} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
