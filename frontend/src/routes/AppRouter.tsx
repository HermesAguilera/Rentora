import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from '../features/landing/LandingPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ADMIN_NAV, ADMIN_TITLES } from '../components/layout/navConfig';
import AdminResumenPage from '../features/admin/AdminResumenPage';
import AdminEspaciosPage from '../features/admin/AdminEspaciosPage';
import AdminUsuariosPage from '../features/admin/AdminUsuariosPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ChatPage from '../features/chat/ChatPage';
import ReservasPage from '../features/reservas/ReservasPage';
import EspaciosPage from '../features/espacios/EspaciosPage';
import NotificacionesPage from '../features/notificaciones/NotificacionesPage';
import ConfiguracionPage from '../features/configuracion/ConfiguracionPage';
import ClientLayout from '../components/layout/ClientLayout';
import InicioPage from '../features/cliente/espacios/InicioPage';
import EspacioDetallePage from '../features/cliente/espacios/EspacioDetallePage';
import FavoritosPage from '../features/cliente/favoritos/FavoritosPage';
import ClienteReservasPage from '../features/cliente/reservas/ReservasPage';
import FirmaContratoPage from '../features/cliente/reservas/FirmaContratoPage';
import DetallePagoPage from '../features/cliente/reservas/DetallePagoPage';
import PagoConfirmadoPage from '../features/cliente/reservas/PagoConfirmadoPage';
import PerfilPage from '../features/cliente/perfil/PerfilPage';
import PublicarEspacioPage from '../features/cliente/publicar/PublicarEspacioPage';
import LoginPage from '../features/auth/LoginPage';
import RegistroPage from '../features/auth/RegistroPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route
          path="/admin"
          element={
            <DashboardLayout items={ADMIN_NAV} titles={ADMIN_TITLES} subtitle="Administración" />
          }
        >
          <Route index element={<AdminResumenPage />} />
          <Route path="espacios" element={<AdminEspaciosPage />} />
          <Route path="usuarios" element={<AdminUsuariosPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="espacios" element={<EspaciosPage />} />
          <Route path="reservas" element={<ReservasPage />} />
          <Route path="mensajes" element={<ChatPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        <Route path="/app" element={<ClientLayout />}>
          <Route index element={<InicioPage />} />
          <Route path="espacios/:id" element={<EspacioDetallePage />} />
          <Route path="espacios/:id/contrato" element={<FirmaContratoPage />} />
          <Route path="espacios/:id/pago" element={<DetallePagoPage />} />
          <Route path="espacios/:id/confirmacion" element={<PagoConfirmadoPage />} />
          <Route path="favoritos" element={<FavoritosPage />} />
          <Route path="reservas" element={<ClienteReservasPage />} />
          <Route path="mensajes" element={<ChatPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="publicar" element={<PublicarEspacioPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
