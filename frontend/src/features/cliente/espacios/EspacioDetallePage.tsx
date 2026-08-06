import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Heart, MapPin, Star, Warehouse } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import { formatLempiras } from '../../../utils/currency';
import { useSpace, useToggleFavorite } from './hooks/useClienteEspaciosData';

export default function EspacioDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: space, isPending, isError } = useSpace(id ?? '');
  const toggleFavorite = useToggleFavorite();

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-6 w-24 animate-pulse rounded bg-[#e7e8f2]" />
        <div className="h-80 animate-pulse rounded-3xl bg-[#e7e8f2]" />
      </div>
    );
  }

  if (isError || !space) {
    return (
      <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
        No se pudo cargar este espacio.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/app"
        className="flex w-fit items-center gap-2 font-['Quicksand',sans-serif] text-sm font-semibold text-[#8b899e] hover:text-[#2b3073]"
      >
        <ArrowLeft className="size-4" />
        Volver
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <div className="relative flex h-80 items-center justify-center rounded-3xl bg-white shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
            <Warehouse className="size-20 text-[#c1bbeb]" strokeWidth={1.2} />
            {space.verified && (
              <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-['Quicksand',sans-serif] text-xs font-semibold text-[#2fa76f] shadow-sm">
                <BadgeCheck className="size-4" />
                Verificado
              </span>
            )}
            <button
              type="button"
              aria-label={space.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              onClick={() => toggleFavorite.mutate(space.id)}
              disabled={toggleFavorite.isPending}
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white text-[#e5484d] shadow-sm transition-opacity disabled:opacity-40"
            >
              <Heart className="size-4" fill={space.favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
                  {space.title}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
                  <MapPin className="size-4" />
                  {space.location} · {space.distanceKm} km
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 font-['Quicksand',sans-serif] text-base font-semibold text-[#2b3073]">
                <Star className="size-4 fill-[#f5b544] text-[#f5b544]" />
                {space.rating.toFixed(1)}
              </span>
            </div>

            <p className="font-['Quicksand',sans-serif] text-sm leading-relaxed text-[#7d7e93]">
              {space.description}
            </p>

            <div className="flex flex-col gap-2">
              <h2 className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
                Comodidades
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {space.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2 font-['Quicksand',sans-serif] text-sm text-[#2b3073]"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-[#4d44b5]" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
            <p className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
              {formatLempiras(space.pricePerMonth)}
              <span className="font-['Quicksand',sans-serif] text-sm font-normal text-[#8b899e]">
                /mes
              </span>
            </p>
            <button
              type="button"
              onClick={() => navigate(`/app/espacios/${space.id}/contrato`)}
              className="rounded-full bg-[#4d44b5] px-6 py-3 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Reservar espacio
            </button>
          </div>

          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
            <Avatar name={space.ownerName} imageUrl={space.ownerAvatarUrl} size={56} />
            <div>
              <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#2b3073]">
                {space.ownerName}
              </p>
              <span className="flex items-center gap-1 font-['Quicksand',sans-serif] text-xs text-[#8b899e]">
                <Star className="size-3 fill-[#f5b544] text-[#f5b544]" />
                {space.ownerRating.toFixed(1)} · Propietario
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
