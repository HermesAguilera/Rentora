import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatLempiras } from '../../../utils/currency';
import { formatLongDate } from '../../../utils/date';
import type { PaymentConfirmation } from './types';

export default function PagoConfirmadoPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const confirmation = location.state as PaymentConfirmation | null;

  if (!confirmation) {
    return <Navigate to={id ? `/app/espacios/${id}` : '/app'} replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <div className="flex flex-col items-center gap-3 bg-[#e5f4ec] px-8 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white text-[#2fa76f]">
            <Check className="size-6" strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-['Poppins',sans-serif] text-lg font-bold text-[#2b3073]">
              ¡Pago confirmado!
            </p>
            <p className="mt-1 font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">
              {confirmation.spaceTitle}
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[#f4f5fc] px-8 py-6">
          <div className="flex items-center justify-between py-3">
            <span className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">Monto</span>
            <span className="font-['Poppins',sans-serif] text-sm font-bold text-[#2b3073]">
              {formatLempiras(confirmation.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">Método</span>
            <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              {confirmation.paymentMethodLabel}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">Fecha</span>
            <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              {formatLongDate(confirmation.date)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-8 pb-8">
          <Link
            to="/app/reservas"
            className="rounded-full border border-[#e7e8f2] px-6 py-3 text-center font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073] transition-colors hover:border-[#4d44b5]"
          >
            Ver historial de pagos
          </Link>
          <Link
            to="/app/reservas"
            className="rounded-full bg-[#4d44b5] px-6 py-3 text-center font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Volver a mi reserva
          </Link>
        </div>
      </div>
    </div>
  );
}
