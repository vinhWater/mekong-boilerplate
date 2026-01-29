'use client';

import { apiRequest } from '@/lib/api/api-client';
import {
  Transaction,
  TransactionFilters,
  TransactionListResponse,
  UserBalance,
} from '@/types/transaction';
import {
  getMockUserBalance,
  getMockTransactions,
  getMockTransaction,
} from '@/lib/api/mock/transaction.mock';

// Check if mock data should be used
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Fetch current user's balance
 */
export const getUserBalance = async (token?: string): Promise<UserBalance> => {
  if (useMockData) {
    return getMockUserBalance();
  }
  return apiRequest<UserBalance>({
    url: '/transactions/balance',
    method: 'GET',
    token,
  });
};

/**
 * Fetch all transactions with pagination and filtering
 */
export const getTransactions = async (
  params?: TransactionFilters,
  token?: string,
): Promise<TransactionListResponse> => {
  if (useMockData) {
    return getMockTransactions(params);
  }
  return apiRequest<TransactionListResponse>({
    url: '/transactions',
    method: 'GET',
    params,
    token,
  });
};

/**
 * Fetch a single transaction by ID
 */
export const getTransaction = async (
  id: number,
  token?: string,
): Promise<Transaction> => {
  if (useMockData) {
    return getMockTransaction(id);
  }
  return apiRequest<Transaction>({
    url: `/transactions/${id}`,
    method: 'GET',
    token,
  });
};
