export interface ClientProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  memberSince: string;
  rating: number;
  reviewsCount: number;
  spacesCount: number;
  reservationsCount: number;
}
