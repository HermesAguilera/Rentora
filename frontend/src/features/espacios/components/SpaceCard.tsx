import { Mail, Pause, Phone, Play } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import { formatLempiras } from '../../../utils/currency';
import { useToggleSpaceStatus } from '../hooks/useEspaciosData';
import type { Space } from '../types';

interface SpaceCardProps {
  space: Space;
}

const STATUS_LABEL: Record<Space['status'], string> = {
  draft: 'Borrador',
  pending_review: 'En revisión',
  active: 'Activo',
  rejected: 'Rechazado',
  paused: 'Pausado',
};

const STATUS_COLOR: Record<Space['status'], string> = {
  draft: 'text-[#a098ae]',
  pending_review: 'text-[#f5b544]',
  active: 'text-[#4cbc9a]',
  rejected: 'text-[#e2665c]',
  paused: 'text-[#ac7f5e]',
};

export default function SpaceCard({ space }: SpaceCardProps) {
  const toggleStatus = useToggleSpaceStatus();
  const canToggle = space.status === 'active' || space.status === 'paused';

  return (
    <article className="relative flex flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <Avatar name={space.name} imageUrl={space.imageUrl} size={100} />

      <div>
        <p className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
          {space.name}
        </p>
        <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
          {space.location} · {space.sizeM2} m²
        </p>
        <p className={`font-['Quicksand',sans-serif] text-sm ${STATUS_COLOR[space.status]}`}>
          {STATUS_LABEL[space.status]} · {formatLempiras(space.pricePerMonth)}/mes
        </p>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`tel:${space.phone}`}
          aria-label={`Llamar a ${space.name}`}
          className="flex size-10 items-center justify-center rounded-full bg-[#4d44b5] text-white transition-opacity hover:opacity-90"
        >
          <Phone className="size-4" />
        </a>
        <a
          href={`mailto:${space.email}`}
          aria-label={`Enviar correo sobre ${space.name}`}
          className="flex size-10 items-center justify-center rounded-full bg-[#4d44b5] text-white transition-opacity hover:opacity-90"
        >
          <Mail className="size-4" />
        </a>
        {canToggle && (
          <button
            type="button"
            aria-label={
              space.status === 'active' ? `Pausar ${space.name}` : `Reactivar ${space.name}`
            }
            title={space.status === 'active' ? 'Pausar anuncio' : 'Reactivar anuncio'}
            disabled={toggleStatus.isPending}
            onClick={() => toggleStatus.mutate({ id: space.id, status: space.status })}
            className="flex size-10 items-center justify-center rounded-full bg-[#4d44b5] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {space.status === 'active' ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </button>
        )}
      </div>
    </article>
  );
}
