export type PaymentStatus = 'paid' | 'pending';

export interface PaymentHistoryItem {
  id: string;
  spaceTitle: string;
  date: string;
  /** Detalle corto de la reserva: duración y estado. */
  detail: string;
  amount: number;
  status: PaymentStatus;
}

export interface PaymentMethod {
  id: string;
  label: string;
  isDefault: boolean;
}

export interface ContractSummary {
  spaceId: string;
  spaceTitle: string;
  ownerName: string;
  monthlyPayment: number;
}

export interface PaymentConfirmation {
  spaceTitle: string;
  amount: number;
  paymentMethodLabel: string;
  date: string;
}
