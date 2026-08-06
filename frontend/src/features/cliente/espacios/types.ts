export type SpaceCategory = 'bodega' | 'garaje' | 'cuarto-exterior' | 'oficina-pequena';

export interface ClientSpace {
  id: string;
  title: string;
  location: string;
  distanceKm: number;
  category: SpaceCategory;
  sizeM2: number;
  available247: boolean;
  verified: boolean;
  rating: number;
  pricePerMonth: number;
  imageUrl: string | null;
  favorite: boolean;
}

export interface ClientSpaceDetail extends ClientSpace {
  description: string;
  amenities: string[];
  ownerName: string;
  ownerAvatarUrl: string | null;
  ownerRating: number;
}
