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
  totalAmount: number;
  /** Comisión que retiene Rentora del total de la reserva. */
  platformFee: number;
  platformFeePercentage: number;
  /** Lo que recibe el anfitrión después de la comisión. */
  hostPayout: number;
}

export type PaymentStatus = 'paid' | 'pending';

export interface Payment {
  /** Es el id de la reserva: el cobro se registra sobre ella. */
  id: string;
  spaceTitle: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  /** El anfitrión solo puede confirmar cobros de reservas vigentes. */
  canConfirm: boolean;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}
