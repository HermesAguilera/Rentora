import type { SpaceCategory } from '../espacios/types';

export interface NewSpaceInput {
  title: string;
  category: SpaceCategory;
  widthMeters: number;
  lengthMeters: number;
  pricePerMonth: number;
  address: string;
  city: string;
  neighborhood: string;
  description: string;
  amenities: string[];
  photos: File[];
}
