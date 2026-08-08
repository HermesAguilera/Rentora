/** Espeja `App\Enums\SpaceStatus` del backend. */
export type SpaceStatus = 'draft' | 'pending_review' | 'active' | 'rejected' | 'paused';

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
