import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, Heart, MapPin, MessageSquare, Star, Warehouse } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import { formatLempiras } from '../../../utils/currency';
import { formatMonthYear } from '../../../utils/date';
import { amenityLabel } from '../../../lib/catalogs';
import { useSpace, useSpaceReviews, useToggleFavorite } from './hooks/useClienteEspaciosData';
import { useStartConversation } from '../../chat/hooks/useChatData';

export default function EspacioDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: space, isPending, isError } = useSpace(id ?? '');
  const { data: reviews } = useSpaceReviews(id ?? '');
  const toggleFavorite = useToggleFavorite();
  const startConversation = useStartConversation();
  const [activePhoto, setActivePhoto] = useState(0);

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
            {space.photos.length > 0 ? (
              <img
                src={space.photos[activePhoto]?.url ?? space.photos[0].url ?? ''}
                alt={space.title}
                className="size-full object-cover"
              />
            ) : (
              <Warehouse className="size-20 text-[#c1bbeb]" strokeWidth={1.2} />
            )}
            {space.verified && (
              <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-['Quicksand',sans-serif] text-xs font-semibold text-[#2fa76f] shadow-sm">
                <BadgeCheck className="size-4" />
                Verificado
              </span>
            )}
            <button
              type="button"
              aria-label={space.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              onClick={() => toggleFavorite.mutate({ id: space.id, isFavorite: space.favorite })}
              disabled={toggleFavorite.isPending}
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white text-[#e5484d] shadow-sm transition-opacity disabled:opacity-40"
            >
              <Heart className="size-4" fill={space.favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {space.photos.length > 1 && (
            <ul className="flex gap-3 overflow-x-auto pb-1">
              {space.photos.map((photo, index) => (
                <li key={photo.id}>
                  <button
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-current={index === activePhoto}
                    className={`size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
                      index === activePhoto ? 'border-[#4d44b5]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={photo.url ?? ''}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
                  {space.title}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
                  <MapPin className="size-4" />
                  {space.location}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 font-['Quicksand',sans-serif] text-base font-semibold text-[#2b3073]">
                {space.reviewCount > 0 ? (
                  <>
                    <Star className="size-4 fill-[#f5b544] text-[#f5b544]" />
                    {space.rating.toFixed(1)}
                    <span className="font-normal text-[#8b899e]">
                      ({space.reviewCount})
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-normal text-[#a098ae]">Sin reseñas</span>
                )}
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
                    {amenityLabel(amenity)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
            <h2 className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
              Reseñas {reviews && reviews.length > 0 && `(${reviews.length})`}
            </h2>

            {reviews && reviews.length === 0 && (
              <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
                Este espacio todavía no tiene reseñas.
              </p>
            )}

            <ul className="flex flex-col divide-y divide-[#f4f5fc]">
              {reviews?.map((review) => (
                <li key={review.id} className="flex gap-4 py-4 first:pt-0">
                  <Avatar name={review.authorName} imageUrl={review.authorAvatarUrl} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-['Quicksand',sans-serif] text-sm font-bold text-[#2b3073]">
                        {review.authorName}
                      </p>
                      <span className="flex items-center gap-0.5 font-['Quicksand',sans-serif] text-xs font-semibold text-[#2b3073]">
                        <Star className="size-3 fill-[#f5b544] text-[#f5b544]" />
                        {review.rating}
                      </span>
                      <span className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
                        · {formatMonthYear(review.date)}
                      </span>
                    </div>
                    <p className="mt-1 font-['Quicksand',sans-serif] text-sm leading-relaxed text-[#7d7e93]">
                      {review.comment}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
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
            <button
              type="button"
              onClick={() => startConversation.mutate(space.id)}
              disabled={startConversation.isPending}
              className="flex items-center justify-center gap-2 rounded-full border border-[#e7e8f2] px-6 py-3 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073] transition-colors hover:border-[#4d44b5] disabled:opacity-40"
            >
              <MessageSquare className="size-4" />
              Contactar al anfitrión
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
