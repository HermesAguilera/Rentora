import { useState } from 'react';
import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { useRecentPayments } from '../hooks/useDashboardData';
import { formatLempiras } from '../../../utils/currency';
import { formatShortDate } from '../../../utils/date';
import type { PaymentStatus } from '../types';

const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
};

const STATUS_STYLES: Record<PaymentStatus, { text: string; iconBg: string }> = {
  paid: { text: 'text-[#2fa76f]', iconBg: '#2fa76f' },
  pending: { text: 'text-[#e2665c]', iconBg: '#e2665c' },
};

export default function RecentPayments() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, isPlaceholderData } = useRecentPayments(page);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1;

  return (
    <section className="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <h2 className="font-['Poppins',sans-serif] text-base font-semibold text-[#2b3073]">
        Pagos recientes
      </h2>

      {isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          No se pudieron cargar los pagos.
        </p>
      )}

      {isPending && (
        <ul className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-[#f4f5fc]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 animate-pulse rounded bg-[#f4f5fc]" />
                <div className="h-3 w-16 animate-pulse rounded bg-[#f4f5fc]" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {data && (
        <ul
          className={`flex flex-1 flex-col gap-4 transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}
        >
          {data.data.map((payment) => {
            const style = STATUS_STYLES[payment.status];
            return (
              <li key={payment.id} className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: style.iconBg }}
                >
                  <Receipt className="size-4 text-white" strokeWidth={2} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
                    {payment.spaceTitle}
                  </p>
                  <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">
                    {formatShortDate(payment.date)}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#2b3073]">
                    {formatLempiras(payment.amount)}
                  </p>
                  <p
                    className={`font-['Quicksand',sans-serif] text-xs font-semibold ${style.text}`}
                  >
                    {STATUS_LABEL[payment.status]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {data && totalPages > 1 && (
        <nav
          aria-label="Paginación de pagos recientes"
          className="mt-auto flex items-center justify-center gap-2 pt-2"
        >
          <button
            type="button"
            aria-label="Página anterior"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex size-8 items-center justify-center rounded-full text-[#8b899e] transition-colors hover:bg-[#f4f5fc] disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              aria-label={`Página ${p}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => setPage(p)}
              className={`flex size-8 items-center justify-center rounded-full font-['Quicksand',sans-serif] text-sm font-semibold transition-colors ${
                p === page ? 'bg-[#2b3073] text-white' : 'text-[#8b899e] hover:bg-[#f4f5fc]'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            aria-label="Página siguiente"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex size-8 items-center justify-center rounded-full text-[#8b899e] transition-colors hover:bg-[#f4f5fc] disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </section>
  );
}
