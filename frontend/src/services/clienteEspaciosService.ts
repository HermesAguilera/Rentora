import { api } from '../lib/api';
import { areaM2 } from '../lib/catalogs';
import type {
  ClientSpace,
  ClientSpaceDetail,
  SpaceCategory,
  SpaceReview,
} from '../features/cliente/espacios/types';

/** `SpacePublicResource` del backend. */
export interface ApiSpace {
  id: string;
  title: string;
  description?: string;
  type: SpaceCategory;
  city: string;
  neighborhood: string | null;
  price_per_month: number;
  size_description: string | null;
  amenities: string[];
  status: string;
  average_rating: number;
  review_count: number;
  is_favorite: boolean;
  primary_photo_url: string | null;
  photos?: { id: string; url: string | null; is_primary: boolean; order: number }[];
  host?: {
    id: string;
    name: string;
    avatar_url: string | null;
    rating: number;
    is_verified: boolean;
  };
}

interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: { name: string; avatar_url: string | null };
}

/** "3m × 4m × 2.5m" -> ancho × largo en m². */
function sizeFromDescription(sizeDescription: string | null): number {
  if (!sizeDescription) return 0;
  const [width, depth] = sizeDescription.split('×').map((part) => parseFloat(part));
  return areaM2(width, depth);
}

export function toClientSpace(space: ApiSpace): ClientSpace {
  return {
    id: space.id,
    title: space.title,
    location: [space.neighborhood, space.city].filter(Boolean).join(', '),
    category: space.type,
    sizeM2: sizeFromDescription(space.size_description),
    available247: space.amenities.includes('24h_access'),
    verified: space.host?.is_verified ?? false,
    rating: space.average_rating,
    reviewCount: space.review_count,
    pricePerMonth: space.price_per_month,
    imageUrl: space.primary_photo_url,
    favorite: space.is_favorite,
  };
}

export async function getSpaces(): Promise<ClientSpace[]> {
  const { data } = await api.get<{ data: ApiSpace[] }>('/spaces', { params: { per_page: 30 } });
  return data.data.map(toClientSpace);
}

export async function getFavoriteSpaces(): Promise<ClientSpace[]> {
  const { data } = await api.get<{ data: ApiSpace[] }>('/me/favorites');
  // El endpoint solo devuelve favoritos, así que el flag siempre va en true.
  return data.data.map((space) => ({ ...toClientSpace(space), favorite: true }));
}

export async function getSpace(id: string): Promise<ClientSpaceDetail | null> {
  const { data } = await api.get<{ data: ApiSpace }>(`/spaces/${id}`);
  const space = data.data;

  // La principal va primero para que sea la que se muestra al abrir el detalle.
  const photos = [...(space.photos ?? [])]
    .filter((photo) => photo.url !== null)
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.order - b.order)
    .map((photo) => ({ id: photo.id, url: photo.url }));

  return {
    ...toClientSpace(space),
    description: space.description ?? '',
    amenities: space.amenities,
    photos,
    ownerName: space.host?.name ?? 'Anfitrión',
    ownerAvatarUrl: space.host?.avatar_url ?? null,
    ownerRating: space.host?.rating ?? 0,
  };
}

export async function getSpaceReviews(id: string): Promise<SpaceReview[]> {
  const { data } = await api.get<{ data: ApiReview[] }>(`/spaces/${id}/reviews`);

  return data.data.map((review) => ({
    id: review.id,
    authorName: review.reviewer?.name ?? 'Inquilino',
    authorAvatarUrl: review.reviewer?.avatar_url ?? null,
    rating: review.rating,
    comment: review.comment ?? '',
    date: review.created_at,
  }));
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  if (isFavorite) await api.delete(`/spaces/${id}/favorite`);
  else await api.post(`/spaces/${id}/favorite`);
}
