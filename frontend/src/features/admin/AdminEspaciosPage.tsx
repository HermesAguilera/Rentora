import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useAdminSpaces, useModerateSpace } from './hooks/useAdminData';
import { CATEGORY_LABEL } from '../../lib/catalogs';
import { apiMessage } from '../../lib/api';
import { formatLempiras } from '../../utils/currency';
import { formatBookingDate } from '../../utils/date';
import type { SpaceStatus } from '../espacios/types';

const FILTERS: { id: SpaceStatus | 'all'; label: string }[] = [
  { id: 'pending_review', label: 'Pendientes' },
  { id: 'active', label: 'Publicados' },
  { id: 'rejected', label: 'Rechazados' },
  { id: 'all', label: 'Todos' },
];

const STATUS_STYLES: Record<SpaceStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Borrador', bg: 'bg-[#f4f5fc]', text: 'text-[#8b899e]' },
  pending_review: { label: 'En revisión', bg: 'bg-[#fdf1d0]', text: 'text-[#b9820b]' },
  active: { label: 'Publicado', bg: 'bg-[#e5f4ec]', text: 'text-[#2fa76f]' },
  rejected: { label: 'Rechazado', bg: 'bg-[#fbe9e7]', text: 'text-[#e2665c]' },
  paused: { label: 'Pausado', bg: 'bg-[#f4f5fc]', text: 'text-[#ac7f5e]' },
};

export default function AdminEspaciosPage() {
  const [filter, setFilter] = useState<SpaceStatus | 'all'>('pending_review');
  const { data: spaces, isPending, isError } = useAdminSpaces(filter === 'all' ? undefined : filter);
  const moderate = useModerateSpace();

  // Id del espacio cuyo formulario de rechazo está abierto.
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  function handleReject(id: string) {
    if (reason.trim().length === 0) return;
    moderate.mutate(
      { id, reason: reason.trim() },
      {
        onSuccess: () => {
          setRejectingId(null);
          setReason('');
        },
      },
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <nav className="flex flex-wrap gap-2" aria-label="Filtrar espacios">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-2xl px-4 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold transition-colors ${
              filter === id
                ? 'bg-[#4d44b5] text-white'
                : 'bg-[#f4f5fc] text-[#8b899e] hover:text-[#2b3073]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          No se pudieron cargar los espacios.
        </p>
      )}

      {isPending && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#f4f5fc]" />
          ))}
        </div>
      )}

      {!isPending && spaces && spaces.length === 0 && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
          {filter === 'pending_review'
            ? 'No hay espacios esperando revisión. Todo al día.'
            : 'No hay espacios en esta categoría.'}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {spaces?.map((space) => {
          const style = STATUS_STYLES[space.status];

          return (
            <li
              key={space.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#e7e8f2] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
                      {space.title}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-['Quicksand',sans-serif] text-xs font-semibold ${style.bg} ${style.text}`}
                    >
                      {style.label}
                    </span>
                  </div>
                  <p className="mt-1 font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
                    {CATEGORY_LABEL[space.category]} · {space.address}
                  </p>
                  <p className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
                    Publicado por {space.hostName} ({space.hostEmail}) ·{' '}
                    {formatBookingDate(space.createdAt)}
                  </p>
                </div>

                <p className="shrink-0 font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
                  {formatLempiras(space.pricePerMonth)}
                  <span className="font-['Quicksand',sans-serif] text-xs font-normal text-[#8b899e]">
                    /mes
                  </span>
                </p>
              </div>

              <p className="font-['Quicksand',sans-serif] text-sm leading-relaxed text-[#7d7e93]">
                {space.description}
              </p>

              {space.status === 'pending_review' && rejectingId !== space.id && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={moderate.isPending}
                    onClick={() => moderate.mutate({ id: space.id })}
                    className="flex items-center gap-2 rounded-full bg-[#2fa76f] px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    <Check className="size-4" strokeWidth={2.5} />
                    Aprobar
                  </button>
                  <button
                    type="button"
                    disabled={moderate.isPending}
                    onClick={() => {
                      setRejectingId(space.id);
                      setReason('');
                    }}
                    className="flex items-center gap-2 rounded-full border border-[#e7e8f2] px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-[#e2665c] transition-colors hover:border-[#e2665c] disabled:opacity-40"
                  >
                    <X className="size-4" strokeWidth={2.5} />
                    Rechazar
                  </button>
                </div>
              )}

              {rejectingId === space.id && (
                <div className="flex flex-col gap-2 rounded-2xl bg-[#fdf5f5] p-4">
                  <label
                    htmlFor={`motivo-${space.id}`}
                    className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]"
                  >
                    Motivo del rechazo
                  </label>
                  <textarea
                    id={`motivo-${space.id}`}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows={2}
                    placeholder="Explícale al anfitrión qué debe corregir..."
                    className="w-full resize-none rounded-2xl border border-[#e7e8f2] bg-white px-4 py-2.5 font-['Quicksand',sans-serif] text-sm text-[#2b3073] focus:border-[#4d44b5] focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={reason.trim().length === 0 || moderate.isPending}
                      onClick={() => handleReject(space.id)}
                      className="rounded-full bg-[#e5484d] px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      Confirmar rechazo
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingId(null)}
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

      {moderate.isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          {apiMessage(moderate.error, 'No se pudo completar la acción.')}
        </p>
      )}
    </div>
  );
}
