import { useMutation, useQuery } from '@tanstack/react-query';
import {
  confirmPayment,
  getContractSummary,
  getPaymentHistory,
  getPaymentMethods,
  signContract,
} from '../../../../services/clienteReservasService';

const clienteReservasKeys = {
  history: ['cliente', 'reservas', 'historial'] as const,
  contract: (spaceId: string) => ['cliente', 'reservas', 'contrato', spaceId] as const,
  paymentMethods: ['cliente', 'reservas', 'metodos-pago'] as const,
};

export function usePaymentHistory() {
  return useQuery({
    queryKey: clienteReservasKeys.history,
    queryFn: getPaymentHistory,
  });
}

export function useContractSummary(spaceId: string) {
  return useQuery({
    queryKey: clienteReservasKeys.contract(spaceId),
    queryFn: () => getContractSummary(spaceId),
    enabled: spaceId.length > 0,
  });
}

export function useSignContract() {
  return useMutation({
    mutationFn: (spaceId: string) => signContract(spaceId),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: clienteReservasKeys.paymentMethods,
    queryFn: getPaymentMethods,
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: ({ spaceId, paymentMethodId }: { spaceId: string; paymentMethodId: string }) =>
      confirmPayment(spaceId, paymentMethodId),
  });
}
