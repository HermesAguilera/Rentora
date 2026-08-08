import { useState } from 'react';
import { BadgeCheck, Ban, Pause, Play } from 'lucide-react';
import Avatar from '../../components/shared/Avatar';
import { useAdminUsers, useUserAction } from './hooks/useAdminData';
import { apiMessage } from '../../lib/api';
import { formatMonthYear } from '../../utils/date';
import type { AdminUserRole, AdminUserStatus } from './types';
import type { UserAction } from '../../services/adminService';

const ROLE_LABEL: Record<AdminUserRole, string> = {
  renter: 'Inquilino',
  host: 'Anfitrión',
  both: 'Anfitrión e inquilino',
  admin: 'Administrador',
};

const STATUS_STYLES: Record<AdminUserStatus, { label: string; bg: string; text: string }> = {
  pending_verification: { label: 'Sin verificar', bg: 'bg-[#fdf1d0]', text: 'text-[#b9820b]' },
  active: { label: 'Activo', bg: 'bg-[#e5f4ec]', text: 'text-[#2fa76f]' },
  suspended: { label: 'Suspendido', bg: 'bg-[#fbe9e7]', text: 'text-[#ac7f5e]' },
  banned: { label: 'Baneado', bg: 'bg-[#fbe9e7]', text: 'text-[#e2665c]' },
};

export default function AdminUsuariosPage() {
  const { data: users, isPending, isError } = useAdminUsers();
  const userAction = useUserAction();

  // Usuario al que se le pide motivo antes de suspender o banear.
  const [pending, setPending] = useState<{ id: string; action: UserAction } | null>(null);
  const [reason, setReason] = useState('');

  function run(id: string, action: UserAction) {
    if (action === 'suspend' || action === 'ban') {
      setPending({ id, action });
      setReason('');
      return;
    }
    userAction.mutate({ id, action });
  }

  function confirmWithReason() {
    if (!pending || reason.trim().length === 0) return;
    userAction.mutate(
      { id: pending.id, action: pending.action, reason: reason.trim() },
      { onSuccess: () => setPending(null) },
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      {isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          No se pudieron cargar los usuarios.
        </p>
      )}

      {isPending && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#f4f5fc]" />
          ))}
        </div>
      )}

      <ul className="flex flex-col divide-y divide-[#f4f5fc]">
        {users?.map((user) => {
          const style = STATUS_STYLES[user.status];
          const showReasonBox = pending?.id === user.id;

          return (
            <li key={user.id} className="flex flex-col gap-3 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar name={user.name} size={44} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-['Quicksand',sans-serif] text-sm font-bold text-[#2b3073]">
                      {user.name}
                    </p>
                    {user.identityVerified && (
                      <BadgeCheck className="size-4 text-[#2fa76f]" aria-label="Identidad verificada" />
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-['Quicksand',sans-serif] text-xs font-semibold ${style.bg} ${style.text}`}
                    >
                      {style.label}
                    </span>
                  </div>
                  <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">
                    {user.email} · {ROLE_LABEL[user.role]} · desde{' '}
                    {formatMonthYear(user.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!user.identityVerified && (
                    <button
                      type="button"
                      title="Verificar identidad"
                      aria-label={`Verificar identidad de ${user.name}`}
                      disabled={userAction.isPending}
                      onClick={() => run(user.id, 'verify-identity')}
                      className="flex size-9 items-center justify-center rounded-full bg-[#e5f4ec] text-[#2fa76f] transition-opacity disabled:opacity-40"
                    >
                      <BadgeCheck className="size-4" />
                    </button>
                  )}

                  {user.status === 'active' ? (
                    <button
                      type="button"
                      title="Suspender"
                      aria-label={`Suspender a ${user.name}`}
                      disabled={userAction.isPending}
                      onClick={() => run(user.id, 'suspend')}
                      className="flex size-9 items-center justify-center rounded-full bg-[#fdf1d0] text-[#b9820b] transition-opacity disabled:opacity-40"
                    >
                      <Pause className="size-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="Reactivar"
                      aria-label={`Reactivar a ${user.name}`}
                      disabled={userAction.isPending}
                      onClick={() => run(user.id, 'reactivate')}
                      className="flex size-9 items-center justify-center rounded-full bg-[#e5f4ec] text-[#2fa76f] transition-opacity disabled:opacity-40"
                    >
                      <Play className="size-4" />
                    </button>
                  )}

                  {user.status !== 'banned' && user.role !== 'admin' && (
                    <button
                      type="button"
                      title="Banear permanentemente"
                      aria-label={`Banear a ${user.name}`}
                      disabled={userAction.isPending}
                      onClick={() => run(user.id, 'ban')}
                      className="flex size-9 items-center justify-center rounded-full bg-[#fbe9e7] text-[#e2665c] transition-opacity disabled:opacity-40"
                    >
                      <Ban className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              {showReasonBox && (
                <div className="flex flex-col gap-2 rounded-2xl bg-[#fdf5f5] p-4">
                  <label
                    htmlFor={`motivo-usuario-${user.id}`}
                    className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]"
                  >
                    Motivo para {pending?.action === 'ban' ? 'banear' : 'suspender'} a {user.name}
                  </label>
                  <input
                    id={`motivo-usuario-${user.id}`}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Ej. Incumplió las normas de la plataforma"
                    className="w-full rounded-2xl border border-[#e7e8f2] bg-white px-4 py-2.5 font-['Quicksand',sans-serif] text-sm text-[#2b3073] focus:border-[#4d44b5] focus:outline-none"
                  />
                  <p className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
                    Se cerrarán todas sus sesiones activas.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={reason.trim().length === 0 || userAction.isPending}
                      onClick={confirmWithReason}
                      className="rounded-full bg-[#e5484d] px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPending(null)}
                      className="rounded-full px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-[#8b899e] hover:text-[#2b3073]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {userAction.isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          {apiMessage(userAction.error, 'No se pudo completar la acción.')}
        </p>
      )}
    </div>
  );
}
