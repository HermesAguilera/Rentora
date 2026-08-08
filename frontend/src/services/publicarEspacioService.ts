import { api } from '../lib/api';
import { uploadSpacePhotos } from './spacePhotosService';
import type { NewSpaceInput } from '../features/cliente/publicar/types';

/**
 * Crea el espacio (queda en borrador), sube sus fotos y lo manda a revisión,
 * que es lo que el usuario entiende por "publicar".
 */
export async function publishSpace(input: NewSpaceInput): Promise<{ id: string }> {
  const { data } = await api.post<{ data: { id: string } }>('/spaces', {
    title: input.title,
    type: input.category,
    description: input.description,
    address: input.address,
    city: input.city,
    neighborhood: input.neighborhood || null,
    price_per_month: input.pricePerMonth,
    width: input.widthMeters,
    length: input.lengthMeters,
    amenities: input.amenities,
  });

  // Las fotos van antes de enviarlo a revisión para que el admin ya las vea.
  if (input.photos.length > 0) {
    await uploadSpacePhotos(data.data.id, input.photos);
  }

  await api.post(`/spaces/${data.data.id}/publish`);

  return { id: data.data.id };
}
