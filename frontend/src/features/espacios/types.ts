export type SpaceStatus = 'active' | 'paused';

export interface Space {
  id: string;
  name: string;
  imageUrl: string | null;
  location: string;
  sizeM2: number;
  status: SpaceStatus;
  pricePerMonth: number;
  phone: string;
  email: string;
}
