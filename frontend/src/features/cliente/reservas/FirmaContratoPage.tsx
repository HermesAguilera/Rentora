import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import FormField, { inputClass } from '../../../components/shared/FormField';
import { formatLempiras } from '../../../utils/currency';
import { apiMessage } from '../../../lib/api';
import { useContractSummary, useSignContract } from './hooks/useClienteReservasData';

/** El backend exige que la reserva empiece después de hoy. */
function tomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function FirmaContratoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contract, isPending } = useContractSummary(id ?? '');
  const signContract = useSignContract();

  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [acceptsCancellation, setAcceptsCancellation] = useState(false);
  const [signature, setSignature] = useState('');
  const [startDate, setStartDate] = useState(tomorrow());
  const [months, setMonths] = useState(12);

  const canSubmit =
    acceptsTerms && acceptsCancellation && signature.trim().length > 0 && startDate.length > 0;

  function handleSubmit() {
    if (!id || !canSubmit) return;
    signContract.mutate(
      { spaceId: id, startDate, months },
      { onSuccess: () => navigate(`/app/espacios/${id}/pago`) },
    );
  }

  if (isPending || !contract) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <div>
          <h1 className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
            📄 Firma de contrato
          </h1>
          <p className="mt-1 font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
            Antes de activar tu alquiler
          </p>
        </div>

        <dl className="flex flex-col divide-y divide-[#f4f5fc]">
          <div className="flex items-center justify-between py-3">
            <dt className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">Espacio</dt>
            <dd className="font-['Quicksand',sans-serif] text-sm font-bold text-[#2b3073]">
              {contract.spaceTitle}
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">Propietario</dt>
            <dd className="font-['Quicksand',sans-serif] text-sm font-bold text-[#2b3073]">
              {contract.ownerName}
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">Pago mensual</dt>
            <dd className="font-['Quicksand',sans-serif] text-sm font-bold text-[#2b3073]">
              {formatLempiras(contract.monthlyPayment)}
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">Total</dt>
            <dd className="font-['Poppins',sans-serif] text-sm font-bold text-[#2b3073]">
              {formatLempiras(contract.monthlyPayment * months)}
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Fecha de inicio">
            <input
              type="date"
              value={startDate}
              min={tomorrow()}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Duración (meses)">
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className={inputClass}
            >
              {[1, 3, 6, 12, 24].map((option) => (
                <option key={option} value={option}>
                  {option} {option === 1 ? 'mes' : 'meses'}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-[#f4f5fc] p-4 font-['Quicksand',sans-serif] text-xs leading-relaxed text-[#7d7e93]">
          <p>
            Este contrato de arrendamiento de espacio se celebra entre el propietario y el
            arrendatario, bajo los términos y condiciones de la plataforma Rentora. El
            arrendatario se compromete a usar el espacio únicamente para los fines declarados,
            mantener en buen estado y realizar los pagos mensuales en la fecha acordada.
          </p>
          <p>
            El propietario garantiza el acceso al espacio durante la vigencia del contrato y se
            compromete a resolver cualquier defecto que no sea atribuible al arrendatario. La
            cancelación anticipada está sujeta a la política de cancelación de Rentora.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={acceptsTerms}
              onChange={(e) => setAcceptsTerms(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[#4d44b5]"
            />
            <span className="font-['Quicksand',sans-serif] text-sm text-[#2b3073]">
              Acepto los términos y condiciones del contrato de alquiler
            </span>
          </label>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={acceptsCancellation}
              onChange={(e) => setAcceptsCancellation(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[#4d44b5]"
            />
            <span className="font-['Quicksand',sans-serif] text-sm text-[#2b3073]">
              Acepto la política de cancelación de Rentora
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
            Firma digital
          </span>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Escribe tu nombre completo"
            className={`${inputClass} text-center font-['Poppins',sans-serif] italic`}
          />
          <p className="flex items-center gap-1.5 font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
            <Lock className="size-3.5" />
            Tu firma queda registrada de forma segura junto con la fecha y hora.
          </p>
        </div>

        {signContract.isError && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
            {apiMessage(signContract.error, 'No se pudo crear la reserva.')}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || signContract.isPending}
          className="rounded-full bg-[#4d44b5] px-6 py-3.5 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {signContract.isPending ? 'Firmando...' : 'Firmar y activar alquiler'}
        </button>
      </div>
    </div>
  );
}
