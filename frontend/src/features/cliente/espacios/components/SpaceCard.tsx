import { Link } from 'react-router-dom';
import { BadgeCheck, Heart, Star, Warehouse } from 'lucide-react';
import { formatLempiras } from '../../../../utils/currency';
import { useToggleFavorite } from '../hooks/useClienteEspaciosData';
import type { ClientSpace, SpaceCategory } from '../types';

interface SpaceCardProps {
  space: ClientSpace;
}

const CATEGORY_LABEL: Record<SpaceCategory, string> = {
  bodega: 'Bodega',
  garaje: 'Garaje',
  'cuarto-exterior': 'Cuarto exterior',
  'oficina-pequena': 'Oficina pequeña',
};

export default function SpaceCard({ space }: SpaceCardProps) {
  const toggleFavorite = useToggleFavorite();

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#e7e8f2] bg-white">
      <div className="relative flex h-[130px] items-center justify-center bg-[#f4f5fc]">
        <Warehouse className="size-11 text-[#c1bbeb]" strokeWidth={1.5} />

        {space.verified && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-['Quicksand',sans-serif] text-xs font-semibold text-[#2fa76f]">
            <BadgeCheck className="size-3.5" />
            Verificado
          </span>
        )}

        <button
          type="button"
          aria-label={space.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          onClick={() => toggleFavorite.mutate(space.id)}
          disabled={toggleFavorite.isPending}
          className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-white text-[#e5484d] transition-opacity disabled:opacity-40"
        >
          <Heart className="size-3.5" fill={space.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
            {space.title}
          </p>
          <span className="flex shrink-0 items-center gap-1 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
            <Star className="size-3.5 fill-[#f5b544] text-[#f5b544]" />
            {space.rating.toFixed(1)}
          </span>
        </div>

        <p className="font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
          {space.location} · {space.distanceKm} km
        </p>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#f4f5fc] px-2.5 py-1 font-['Quicksand',sans-serif] text-xs font-semibold text-[#2b3073]">
            {CATEGORY_LABEL[space.category]}
          </span>
          <span className="rounded-full bg-[#f4f5fc] px-2.5 py-1 font-['Quicksand',sans-serif] text-xs font-semibold text-[#2b3073]">
            {space.sizeM2} m²
          </span>
          {space.available247 && (
            <span className="rounded-full bg-[#f4f5fc] px-2.5 py-1 font-['Quicksand',sans-serif] text-xs font-semibold text-[#2b3073]">
              24/7
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
            {formatLempiras(space.pricePerMonth)}
            <span className="font-['Quicksand',sans-serif] text-xs font-normal text-[#8b899e]">
              /mes
            </span>
          </p>
          <Link
            to={`/app/espacios/${space.id}`}
            className="rounded-full bg-[#4d44b5] px-4 py-2 font-['Quicksand',sans-serif] text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
