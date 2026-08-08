/** Espeja `App\Enums\SpaceType` del backend. */
export type SpaceCategory = 'warehouse' | 'garage' | 'room' | 'closet' | 'other';

export interface ClientSpace {
  id: string;
  title: string;
  location: string;
  category: SpaceCategory;
  sizeM2: number;
  available247: boolean;
  verified: boolean;
  rating: number;
  reviewCount: number;
  pricePerMonth: number;
  imageUrl: string | null;
  favorite: boolean;
}

export interface ClientSpaceDetail extends ClientSpace {
  description: string;
  amenities: string[];
  photos: { id: string; url: string | null }[];
  ownerName: string;
  ownerAvatarUrl: string | null;
  ownerRating: number;
}

export interface SpaceReview {
  id: string;
  authorName: string;
  authorAvatarUrl: string | null;
  rating: number;
  comment: string;
  date: string;
}
