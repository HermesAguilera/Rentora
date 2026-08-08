import { Check, X } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import { usePendingRequests, useDecidePendingRequest } from '../hooks/useDashboardData';
import { formatDurationMonths } from '../../../utils/date';
import { formatLempiras } from '../../../utils/currency';

export default function PendingRequests() {
  const { data: requests, isPending, isError } = usePendingRequests();
  const decide = useDecidePendingRequest();

  const busyId = decide.isPending ? decide.variables?.id : null;

  return (
    <section className="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <h2 className="font-['Poppins',sans-serif] text-base font-semibold text-[#2b3073]">
        Solicitudes pendientes
      </h2>

      {isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          No se pudieron cargar las solicitudes.
        </p>
      )}

      {isPending && (
        <ul className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-[#f4f5fc]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-[#f4f5fc]" />
                <div className="h-3 w-24 animate-pulse rounded bg-[#f4f5fc]" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isPending && requests && requests.length === 0 && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
          No tienes solicitudes pendientes.
        </p>
      )}

      {!isPending && requests && requests.length > 0 && (
        <ul className="flex flex-col gap-4">
          {requests.map((request) => (
            <li key={request.id} className="flex items-center gap-3">
              <Avatar name={request.renterName} imageUrl={request.renterAvatarUrl} size={40} />

              <div className="min-w-0 flex-1">
                <p className="truncate font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
                  {request.renterName}{' '}
                  <span className="font-medium text-[#5b52c9]">{request.spaceTitle}</span>
                </p>
                <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">
                  {formatDurationMonths(request.durationMonths)} ·{' '}
                  {formatLempiras(request.totalAmount)} en total
                </p>
                <p className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
                  Rentora cobra {request.platformFeePercentage}% de comisión (
                  {formatLempiras(request.platformFee)}). Recibirás{' '}
                  {formatLempiras(request.hostPayout)}.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={`Aceptar solicitud de ${request.renterName}`}
                  disabled={busyId === request.id}
                  onClick={() => decide.mutate({ id: request.id, decision: 'accepted' })}
                  className="flex size-9 items-center justify-center rounded-full bg-[#e5f4ec] text-[#2fa76f] transition-opacity disabled:opacity-40"
                >
                  <Check className="size-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label={`Rechazar solicitud de ${request.renterName}`}
                  disabled={busyId === request.id}
                  onClick={() => decide.mutate({ id: request.id, decision: 'rejected' })}
                  className="flex size-9 items-center justify-center rounded-full bg-[#fbe9e7] text-[#e2665c] transition-opacity disabled:opacity-40"
                >
                  <X className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
