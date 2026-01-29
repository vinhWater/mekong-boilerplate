// Transaction types
export type TransactionType =
  | 'top_up'
  | 'subscription'
  | 'mockup_image'
  | 'mockup_video'
  | 'refund'
  | 'bonus'
  | 'adjustment';

export type PaymentMethod =
  | 'stripe'
  | 'crypto'
  | 'vnd_transfer'
  | 'balance'
  | 'admin';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'canceled';

export type TransactionReferenceType = 'store' | 'mockup_image' | 'mockup_video';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: string;
  balanceAfter: string | null;
  balanceBefore: string | null;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  referenceId: number | null;
  referenceType: TransactionReferenceType | null;
  externalPaymentId: string | null;
  metadata: Record<string, any> | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  type?: TransactionType;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  externalPaymentId?: string;
  createdDateFrom?: number;
  createdDateTo?: number;
}

export interface TransactionListResponse {
  data: Transaction[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface UserBalance {
  balance: string;
}
