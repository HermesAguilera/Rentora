import { api } from '../lib/api';
import { areaM2 } from '../lib/catalogs';
import { useAuthStore } from '../lib/authStore';
import type { Space, SpaceStatus } from '../features/espacios/types';

/** `GET /me/spaces` devuelve el paginador crudo de Eloquent, no un Resource. */
interface ApiOwnSpace {
  uuid: string;
  title: string;
  status: SpaceStatus;
  price_per_month: string;
  city: string;
  neighborhood: string | null;
  width_meters: string | null;
  depth_meters: string | null;
  primary_photo_url: string | null;
}

/** Pausa un anuncio activo o vuelve a activarlo si estaba pausado. */
export async function toggleSpaceStatus(id: string, status: SpaceStatus): Promise<void> {
  await api.post(`/spaces/${id}/${status === 'active' ? 'pause' : 'reactivate'}`);
}

export async function getSpaces(): Promise<Space[]> {
  const { data } = await api.get<{ data: ApiOwnSpace[] }>('/me/spaces', {
    params: { per_page: 50 },
  });
  const owner = useAuthStore.getState().user;

  return data.data.map((space) => ({
    id: space.uuid,
    name: space.title,
    imageUrl: space.primary_photo_url,
    location: [space.neighborhood, space.city].filter(Boolean).join(', '),
    sizeM2: areaM2(space.width_meters, space.depth_meters),
    status: space.status,
    pricePerMonth: Number(space.price_per_month),
    // Los contactos del anuncio son los del anfitrión dueño de la sesión.
    phone: owner?.phone ?? '',
    email: owner?.email ?? '',
  }));
}
