import type { SpaceCategory } from '../espacios/types';

export interface NewSpaceInput {
  title: string;
  category: SpaceCategory;
  sizeM2: number;
  pricePerMonth: number;
  location: string;
  description: string;
  amenities: string[];
  available247: boolean;
}
