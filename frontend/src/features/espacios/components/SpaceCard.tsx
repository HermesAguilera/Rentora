import { Mail, MoreVertical, Pencil, Phone } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import { formatLempiras } from '../../../utils/currency';
import type { Space } from '../types';

interface SpaceCardProps {
  space: Space;
}

const STATUS_LABEL: Record<Space['status'], string> = {
  active: 'Activo',
  paused: 'Pausado',
};

const STATUS_COLOR: Record<Space['status'], string> = {
  active: 'text-[#4cbc9a]',
  paused: 'text-[#ac7f5e]',
};

export default function SpaceCard({ space }: SpaceCardProps) {
  return (
    <article className="relative flex flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <button
        type="button"
        aria-label={`Más opciones para ${space.name}`}
        className="absolute right-6 top-6 text-[#a098ae] hover:text-[#4d44b5]"
      >
        <MoreVertical className="size-5" />
      </button>

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
        <button
          type="button"
          aria-label={`Editar ${space.name}`}
          className="flex size-10 items-center justify-center rounded-full bg-[#4d44b5] text-white transition-opacity hover:opacity-90"
        >
          <Pencil className="size-4" />
        </button>
      </div>
    </article>
  );
}
