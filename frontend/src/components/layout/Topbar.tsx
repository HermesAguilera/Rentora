import { LogOut } from 'lucide-react';
import Avatar from '../shared/Avatar';
import BackButton from '../shared/BackButton';
import { useCurrentUser, useLogout } from '../../features/auth/hooks/useAuth';

interface TopbarProps {
  title: string;
  /** Ruta de respaldo del botón regresar. Si no se pasa, no se muestra. */
  backTo?: string;
}

const ROLE_LABEL: Record<string, string> = {
  renter: 'Inquilino',
  host: 'Anfitrión',
  both: 'Anfitrión e inquilino',
  admin: 'Administrador',
};

export default function Topbar({ title, backTo }: TopbarProps) {
  const currentUser = useCurrentUser();
  const logout = useLogout();
  const user = {
    name: currentUser?.name ?? '',
    role: ROLE_LABEL[currentUser?.role ?? ''] ?? '',
    avatarUrl: currentUser?.avatarUrl ?? null,
  };

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {backTo && <BackButton fallback={backTo} />}
        <h1 className="truncate font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              {user.name}
            </p>
            <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">{user.role}</p>
          </div>
          <Avatar name={user.name} imageUrl={user.avatarUrl} size={40} />
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="flex size-10 items-center justify-center rounded-full bg-white text-[#8b899e] shadow-sm transition-colors hover:text-[#e5484d] disabled:opacity-40"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
