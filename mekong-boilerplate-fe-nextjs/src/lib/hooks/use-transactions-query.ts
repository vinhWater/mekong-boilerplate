'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  getTransactions,
  getTransaction,
  getUserBalance,
} from '@/lib/api/services/transaction-service';
import { TransactionFilters } from '@/types/transaction';
import { createQueryKeys } from '@/lib/api/api-client';

// Create query keys for transactions
export const transactionKeys = createQueryKeys('transactions');

/**
 * Hook for fetching user balance
 */
export const useUserBalance = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: transactionKeys.list(['balance']),
    queryFn: () => getUserBalance(session?.backendToken),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for fetching transactions with pagination and filtering
 */
export const useTransactions = (filters: TransactionFilters = {}) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => getTransactions(filters, session?.backendToken),
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook for fetching a single transaction by ID
 */
export const useTransaction = (id: number) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => getTransaction(id, session?.backendToken),
    enabled: isAuthenticated && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
