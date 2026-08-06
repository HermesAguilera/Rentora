import type { ClientSpace, ClientSpaceDetail } from '../features/cliente/espacios/types';

/**
 * Mock data layer for the client-facing "Inicio" / space browsing module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

let SPACES: ClientSpace[] = [
  {
    id: 'space-1',
    title: 'Bodega Amalia',
    location: 'Col. Palmira',
    distanceKm: 7.4,
    category: 'bodega',
    sizeM2: 20,
    available247: true,
    verified: true,
    rating: 4.9,
    pricePerMonth: 2500,
    imageUrl: null,
    favorite: true,
  },
  {
    id: 'space-2',
    title: 'Garaje Lomas del Guijarro',
    location: 'Lomas del Guijarro',
    distanceKm: 3.1,
    category: 'garaje',
    sizeM2: 12,
    available247: true,
    verified: true,
    rating: 4.7,
    pricePerMonth: 800,
    imageUrl: null,
    favorite: false,
  },
  {
    id: 'space-3',
    title: 'Cuarto exterior Miraflores',
    location: 'Miraflores',
    distanceKm: 5.8,
    category: 'cuarto-exterior',
    sizeM2: 16,
    available247: false,
    verified: true,
    rating: 4.6,
    pricePerMonth: 1800,
    imageUrl: null,
    favorite: false,
  },
  {
    id: 'space-4',
    title: 'Oficina pequeña Palmira',
    location: 'Col. Palmira',
    distanceKm: 6.2,
    category: 'oficina-pequena',
    sizeM2: 18,
    available247: false,
    verified: true,
    rating: 4.8,
    pricePerMonth: 3200,
    imageUrl: null,
    favorite: false,
  },
  {
    id: 'space-5',
    title: 'Bodega Kennedy',
    location: 'Coronel Kennedy',
    distanceKm: 9.5,
    category: 'bodega',
    sizeM2: 22,
    available247: true,
    verified: true,
    rating: 4.5,
    pricePerMonth: 2100,
    imageUrl: null,
    favorite: false,
  },
  {
    id: 'space-6',
    title: 'Garaje Los Próceres',
    location: 'Los Próceres',
    distanceKm: 4.4,
    category: 'garaje',
    sizeM2: 14,
    available247: true,
    verified: true,
    rating: 4.9,
    pricePerMonth: 950,
    imageUrl: null,
    favorite: true,
  },
];

const DETAIL_EXTRAS: Record<
  string,
  Pick<ClientSpaceDetail, 'description' | 'amenities' | 'ownerName' | 'ownerAvatarUrl' | 'ownerRating'>
> = {
  'space-1': {
    description:
      'Bodega techada con acceso vehicular directo, ideal para almacenamiento de mercadería o mudanza temporal. Piso de concreto pulido y buena ventilación.',
    amenities: ['Acceso 24/7', 'Vigilancia', 'Cámaras de seguridad', 'Acceso vehicular', 'Iluminación LED'],
    ownerName: 'Ana Reyes',
    ownerAvatarUrl: null,
    ownerRating: 4.9,
  },
  'space-2': {
    description:
      'Garaje techado en zona residencial segura, con portón eléctrico y espacio para un vehículo mediano.',
    amenities: ['Acceso 24/7', 'Portón eléctrico', 'Vigilancia'],
    ownerName: 'Luis Bonilla',
    ownerAvatarUrl: null,
    ownerRating: 4.7,
  },
  'space-3': {
    description:
      'Cuarto exterior independiente con entrada propia, ideal para bodega personal o taller pequeño.',
    amenities: ['Entrada independiente', 'Toma eléctrica', 'Piso de cemento'],
    ownerName: 'Karen Hernández',
    ownerAvatarUrl: null,
    ownerRating: 4.6,
  },
  'space-4': {
    description:
      'Oficina pequeña amueblada en zona comercial, con internet de alta velocidad y área de recepción compartida.',
    amenities: ['Internet incluido', 'Mobiliario básico', 'Aire acondicionado', 'Recepción compartida'],
    ownerName: 'Diego Flores',
    ownerAvatarUrl: null,
    ownerRating: 4.8,
  },
  'space-5': {
    description:
      'Bodega amplia con acceso para camiones de carga, ubicada cerca de las principales vías de la ciudad.',
    amenities: ['Acceso 24/7', 'Acceso para camiones', 'Vigilancia', 'Cámaras de seguridad'],
    ownerName: 'María López',
    ownerAvatarUrl: null,
    ownerRating: 4.5,
  },
  'space-6': {
    description:
      'Garaje seguro en Los Próceres, techado y con acceso controlado, a pocos minutos del centro.',
    amenities: ['Acceso 24/7', 'Acceso controlado', 'Techado'],
    ownerName: 'Diego Flores',
    ownerAvatarUrl: null,
    ownerRating: 4.9,
  },
};

export function getSpaces(): Promise<ClientSpace[]> {
  return delay([...SPACES]);
}

export function getFavoriteSpaces(): Promise<ClientSpace[]> {
  return delay(SPACES.filter((space) => space.favorite));
}

export function getSpace(id: string): Promise<ClientSpaceDetail | null> {
  const space = SPACES.find((item) => item.id === id);
  if (!space) return delay(null);
  const extras = DETAIL_EXTRAS[id];
  return delay({ ...space, ...extras });
}

export function toggleFavorite(id: string): Promise<ClientSpace | null> {
  SPACES = SPACES.map((space) =>
    space.id === id ? { ...space, favorite: !space.favorite } : space,
  );
  return delay(SPACES.find((space) => space.id === id) ?? null);
}
