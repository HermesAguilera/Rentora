import { api } from '../lib/api';

export interface SpacePhoto {
  id: string;
  url: string | null;
  isPrimary: boolean;
  order: number;
}

interface ApiPhoto {
  id: string;
  url: string | null;
  is_primary: boolean;
  order: number;
}

export const MAX_PHOTOS = 10;
export const MAX_PHOTO_MB = 5;

export function toSpacePhoto(photo: ApiPhoto): SpacePhoto {
  return {
    id: photo.id,
    url: photo.url,
    isPrimary: photo.is_primary,
    order: photo.order,
  };
}

export async function uploadSpacePhoto(spaceId: string, file: File): Promise<SpacePhoto> {
  const form = new FormData();
  form.append('photo', file);

  const { data } = await api.post<{ data: ApiPhoto }>(`/spaces/${spaceId}/photos`, form);
  return toSpacePhoto(data.data);
}

/** Sube las fotos una por una: el endpoint recibe un archivo por petición. */
export async function uploadSpacePhotos(spaceId: string, files: File[]): Promise<void> {
  for (const file of files.slice(0, MAX_PHOTOS)) {
    await uploadSpacePhoto(spaceId, file);
  }
}

export async function deleteSpacePhoto(spaceId: string, photoId: string): Promise<void> {
  await api.delete(`/spaces/${spaceId}/photos/${photoId}`);
}

export async function setPrimaryPhoto(spaceId: string, photoId: string): Promise<void> {
  await api.patch(`/spaces/${spaceId}/photos/${photoId}/set-primary`);
}
