'use client';

import {
  Transaction,
  TransactionFilters,
  TransactionListResponse,
  UserBalance,
} from '@/types/transaction';

// Mock data storage
const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'top_up',
    amount: '500.00',
    status: 'completed',
    description: 'Initial deposit',
    metadata: {},
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T10:05:00Z').toISOString(),
    balanceAfter: '500.00',
    balanceBefore: '0.00',
    paymentMethod: 'stripe',
    referenceId: null,
    referenceType: null,
    externalPaymentId: 'pi_mock_1',
  },
  {
    id: 2,
    type: 'subscription',
    amount: '-25.50',
    status: 'completed',
    description: 'Monthly subscription',
    metadata: {},
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    balanceAfter: '474.50',
    balanceBefore: '500.00',
    paymentMethod: 'balance',
    referenceId: null,
    referenceType: null,
    externalPaymentId: null,
  },
  {
    id: 3,
    type: 'adjustment',
    amount: '-10.00',
    status: 'pending',
    description: 'Extra service fee',
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    balanceAfter: null,
    balanceBefore: '474.50',
    paymentMethod: 'balance',
    referenceId: null,
    referenceType: null,
    externalPaymentId: null,
  },
];

const mockUserBalance: UserBalance = {
  balance: '464.50',
};

/**
 * Simulate API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock: Get user balance
 */
export const getMockUserBalance = async (): Promise<UserBalance> => {
  await delay();
  return { ...mockUserBalance };
};

/**
 * Filter and sort transactions
 */
const applyFilters = (
  transactions: Transaction[],
  params?: TransactionFilters
): Transaction[] => {
  let filtered = [...transactions];

  // Filter by type
  if (params?.type) {
    filtered = filtered.filter(t => t.type === params.type);
  }

  // Filter by status
  if (params?.status) {
    filtered = filtered.filter(t => t.status === params.status);
  }

  // Filter by date range
  if (params?.createdDateFrom) {
    const startDate = params.createdDateFrom;
    filtered = filtered.filter(t => new Date(t.createdAt).getTime() >= startDate);
  }
  if (params?.createdDateTo) {
    const endDate = params.createdDateTo;
    filtered = filtered.filter(t => new Date(t.createdAt).getTime() <= endDate);
  }

  // Sorting
  const sortField = params?.sortField || 'createdAt';
  const sortDirection = params?.sortDirection || 'desc';

  filtered.sort((a, b) => {
    const field = sortField as keyof Transaction;
    const aValue = a[field];
    const bValue = b[field];

    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    let aComp: number | string = 0;
    let bComp: number | string = 0;

    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aComp = new Date(aValue as string).getTime();
      bComp = new Date(bValue as string).getTime();
    } else if (sortField === 'amount') {
      aComp = parseFloat(aValue as string);
      bComp = parseFloat(bValue as string);
    } else {
      aComp = aValue as string | number;
      bComp = bValue as string | number;
    }

    if (aComp < bComp) return sortDirection === 'asc' ? -1 : 1;
    if (aComp > bComp) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};

/**
 * Mock: Get transactions list
 */
export const getMockTransactions = async (
  params?: TransactionFilters
): Promise<TransactionListResponse> => {
  await delay();

  const filtered = applyFilters(mockTransactions, params);

  // Pagination
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      totalItems: filtered.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: page,
    },
  };
};

/**
 * Mock: Get single transaction
 */
export const getMockTransaction = async (id: number): Promise<Transaction> => {
  await delay();

  const transaction = mockTransactions.find(t => t.id === id);
  if (!transaction) {
    throw new Error(`Transaction with ID ${id} not found`);
  }

  return transaction;
};
