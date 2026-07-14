import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  decidePendingRequest,
  getAvailableIncomeYears,
  getDashboardSummary,
  getIncomeBalance,
  getPendingRequests,
  getRecentPayments,
  type PendingRequestDecision,
} from '../../../services/dashboardService';

const dashboardKeys = {
  summary: ['dashboard', 'summary'] as const,
  incomeYears: ['dashboard', 'income-years'] as const,
  income: (year: number) => ['dashboard', 'income', year] as const,
  pendingRequests: ['dashboard', 'pending-requests'] as const,
  payments: (page: number) => ['dashboard', 'payments', page] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: getDashboardSummary,
  });
}

export function useIncomeYears() {
  return useQuery({
    queryKey: dashboardKeys.incomeYears,
    queryFn: getAvailableIncomeYears,
    staleTime: Infinity,
  });
}

export function useIncomeBalance(year: number) {
  return useQuery({
    queryKey: dashboardKeys.income(year),
    queryFn: () => getIncomeBalance(year),
    enabled: Number.isFinite(year),
  });
}

export function usePendingRequests() {
  return useQuery({
    queryKey: dashboardKeys.pendingRequests,
    queryFn: getPendingRequests,
  });
}

export function useDecidePendingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: PendingRequestDecision }) =>
      decidePendingRequest(id, decision),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: dashboardKeys.pendingRequests });
      const previous = queryClient.getQueryData(dashboardKeys.pendingRequests);
      queryClient.setQueryData(
        dashboardKeys.pendingRequests,
        (current: Awaited<ReturnType<typeof getPendingRequests>> | undefined) =>
          current?.filter((request) => request.id !== id) ?? current,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(dashboardKeys.pendingRequests, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.pendingRequests });
    },
  });
}

export function useRecentPayments(page: number) {
  return useQuery({
    queryKey: dashboardKeys.payments(page),
    queryFn: () => getRecentPayments(page),
    placeholderData: (previous) => previous,
  });
}
