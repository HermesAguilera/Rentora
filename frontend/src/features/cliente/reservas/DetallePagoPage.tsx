import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { formatLempiras } from '../../../utils/currency';
import {
  useConfirmPayment,
  useContractSummary,
  usePaymentMethods,
} from './hooks/useClienteReservasData';

export default function DetallePagoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contract, isPending: isContractPending } = useContractSummary(id ?? '');
  const { data: methods, isPending: isMethodsPending } = usePaymentMethods();
  const confirmPayment = useConfirmPayment();

  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  useEffect(() => {
    const defaultMethod = methods?.find((method) => method.isDefault);
    if (defaultMethod) setSelectedMethodId(defaultMethod.id);
  }, [methods]);

  function handleConfirm() {
    if (!id || !selectedMethodId) return;
    confirmPayment.mutate(
      { spaceId: id, paymentMethodId: selectedMethodId },
      {
        onSuccess: (confirmation) => {
          if (!confirmation) return;
          navigate(`/app/espacios/${id}/confirmacion`, { state: confirmation });
        },
      },
    );
  }

  if (isContractPending || isMethodsPending || !contract) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <div>
          <h1 className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
            Detalle de pago
          </h1>
          <p className="mt-1 font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
            {contract.spaceTitle}
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#f4f5fc]">
          <div className="flex items-center justify-between py-3">
            <span className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">
              Pago mensual
            </span>
            <span className="font-['Quicksand',sans-serif] text-sm text-[#2b3073]">
              {formatLempiras(contract.monthlyPayment)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-['Poppins',sans-serif] text-sm font-bold text-[#2b3073]">
              Total
            </span>
            <span className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
              {formatLempiras(contract.monthlyPayment)}
            </span>
          </div>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
            Métodos de pago
          </legend>

          {methods?.map((method) => (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
                selectedMethodId === method.id
                  ? 'border-[#4d44b5] bg-[#f4f5fc]'
                  : 'border-[#e7e8f2] hover:border-[#c1bbeb]'
              }`}
            >
              <CreditCard className="size-4 shrink-0 text-[#8b899e]" />
              <span className="flex-1 font-['Quicksand',sans-serif] text-sm text-[#2b3073]">
                {method.label}
              </span>
              <input
                type="radio"
                name="payment-method"
                checked={selectedMethodId === method.id}
                onChange={() => setSelectedMethodId(method.id)}
                className="size-4 shrink-0 accent-[#4d44b5]"
              />
            </label>
          ))}

          <p className="px-1 pt-1 font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
            El pago se coordina directamente con el anfitrión. Rentora aún no procesa pagos en
            línea.
          </p>
        </fieldset>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedMethodId || confirmPayment.isPending}
          className="rounded-full bg-[#4d44b5] px-6 py-3.5 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {confirmPayment.isPending
            ? 'Procesando...'
            : `Confirmar pago de ${formatLempiras(contract.monthlyPayment)}`}
        </button>
      </div>
    </div>
  );
}
