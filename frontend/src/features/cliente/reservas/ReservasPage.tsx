import { Receipt } from 'lucide-react';
import { usePaymentHistory } from './hooks/useClienteReservasData';
import { formatLempiras } from '../../../utils/currency';
import { formatBookingDate } from '../../../utils/date';
import type { PaymentStatus } from './types';

const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
};

const STATUS_STYLES: Record<PaymentStatus, { text: string; bg: string }> = {
  paid: { text: 'text-[#2fa76f]', bg: 'bg-[#e5f4ec]' },
  pending: { text: 'text-[#b9820b]', bg: 'bg-[#fdf1d0]' },
};

export default function ReservasPage() {
  const { data: payments, isPending, isError } = usePaymentHistory();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
        Historial de pagos
      </h1>

      <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        {isError && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
            No se pudieron cargar tus pagos.
          </p>
        )}

        {isPending && (
          <ul className="flex flex-col divide-y divide-[#f4f5fc]">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-4 py-4">
                <div className="size-10 shrink-0 animate-pulse rounded-full bg-[#f4f5fc]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 animate-pulse rounded bg-[#f4f5fc]" />
                  <div className="h-3 w-28 animate-pulse rounded bg-[#f4f5fc]" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isPending && payments && payments.length === 0 && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
            Aún no tienes pagos registrados.
          </p>
        )}

        {!isPending && payments && payments.length > 0 && (
          <ul className="flex flex-col divide-y divide-[#f4f5fc]">
            {payments.map((payment) => {
              const style = STATUS_STYLES[payment.status];
              return (
                <li key={payment.id} className="flex items-center gap-4 py-4">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}
                  >
                    <Receipt className="size-4" strokeWidth={2} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
                      {payment.spaceTitle}
                    </p>
                    <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">
                      {formatBookingDate(payment.date)} · {payment.detail}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-['Quicksand',sans-serif] text-xs font-semibold ${style.bg} ${style.text}`}
                    >
                      {STATUS_LABEL[payment.status]}
                    </span>
                    <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#2b3073]">
                      {formatLempiras(payment.amount)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
