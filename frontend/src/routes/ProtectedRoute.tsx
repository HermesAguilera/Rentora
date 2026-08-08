import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

interface ProtectedRouteProps {
  /** Si se indica, solo estos roles pueden entrar. */
  roles?: string[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />;
  }

  return <Outlet />;
}
