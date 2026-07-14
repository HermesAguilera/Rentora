export interface DashboardSummary {
  publishedSpaces: number;
  incomeThisMonth: number;
  activeBookings: number;
  rating: number;
}

export interface IncomePoint {
  /** 0-11 (Jan-Dec) */
  monthIndex: number;
  total: number;
}

export interface IncomeBalance {
  year: number;
  points: IncomePoint[];
}

export interface PendingRequest {
  id: string;
  renterName: string;
  renterAvatarUrl: string | null;
  spaceTitle: string;
  durationMonths: number;
  requestedAt: string;
}

export type PaymentStatus = 'paid' | 'pending';

export interface Payment {
  id: string;
  spaceTitle: string;
  date: string;
  amount: number;
  status: PaymentStatus;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}
