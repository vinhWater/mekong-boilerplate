'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { TransactionFilters, TransactionsTable } from '@/components/transactions';
import {
  useUserBalance,
  useTransactions,
} from '@/lib/hooks';
import { useTransactionsStore } from '@/lib/store/transactions-store';
import { Transaction } from '@/types/transaction';
import {
  CreditCard,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
} from 'lucide-react';

export default function BillingPage() {
  const router = useRouter();

  // Use Zustand store for persistent state
  const {
    filters,
    setFilters,
    resetFilters,
    isFiltersPanelOpen,
    setFiltersPanelOpen,
  } = useTransactionsStore();

  // Fetch user balance
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useUserBalance();

  // Fetch transactions with filters
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useTransactions(filters);

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [sortField, sortDirection] = value.split('-');
    setFilters({
      sortField,
      sortDirection: sortDirection as 'asc' | 'desc',
      page: 1, // Reset to first page on sort change
    });
  };

  // Handle view transaction details
  const handleViewDetails = (transaction: Transaction) => {
    router.push(`/client/billing/transaction/${transaction.id}`);
  };

  // Handle top up (placeholder for future implementation)
  const handleTopUp = () => {
    // TODO: Implement top up functionality
    console.log('Top up functionality will be implemented in a separate task');
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Billing</h1>
      </div>

      {/* Current Balance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingBalance ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  Loading...
                </div>
              ) : (
                formatCurrency(balanceData?.balance || '0')
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={handleTopUp} className="flex-1">
              <CreditCard className="mr-2 h-4 w-4" />
              Top Up
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex items-center gap-2">
            <Select
              value={`${filters.sortField || 'createdAt'}-${filters.sortDirection || 'desc'}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest first</SelectItem>
                <SelectItem value="createdAt-asc">Oldest first</SelectItem>
                <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                <SelectItem value="type-asc">Type A-Z</SelectItem>
                <SelectItem value="status-asc">Status A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters Panel */}
        <TransactionFilters
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={resetFilters}
          isOpen={isFiltersPanelOpen}
          onToggle={() => setFiltersPanelOpen(!isFiltersPanelOpen)}
        />

        {/* Transactions Table */}
        <TransactionsTable
          transactions={transactionsData?.data || []}
          isLoading={isLoadingTransactions}
          onViewDetails={handleViewDetails}
        />

        {/* Pagination */}
        {transactionsData && transactionsData.meta.totalItems > 0 && (
          <Card className="pt-0" style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
            <CardFooter className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Items per page:</span>
                <Select
                  value={filters.limit?.toString() || "20"}
                  onValueChange={(value) => setFilters({ limit: parseInt(value), page: 1 })}
                >
                  <SelectTrigger className="w-[80px] h-8">
                    <SelectValue placeholder="20" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground ml-4">
                  Showing {transactionsData.data.length} of {transactionsData.meta.totalItems} transactions
                </span>
              </div>

              <Pagination>
                <PaginationContent>
                  {/* First page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setFilters({ page: 1 })}
                      disabled={(filters.page || 1) <= 1 || isLoadingTransactions}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                      <span className="sr-only">Go to first page</span>
                    </Button>
                  </PaginationItem>

                  {/* Previous page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => (filters.page || 1) > 1 ? setFilters({ page: Math.max(1, (filters.page || 1) - 1) }) : undefined}
                      disabled={(filters.page || 1) <= 1 || isLoadingTransactions}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      <span className="sr-only">Go to previous page</span>
                    </Button>
                  </PaginationItem>

                  {/* Current page indicator */}
                  <PaginationItem>
                    <span className="px-4 py-2">
                      Page {filters.page || 1} of {transactionsData.meta.totalPages || 1}
                    </span>
                  </PaginationItem>

                  {/* Next page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => (filters.page || 1) < (transactionsData.meta.totalPages || 1) ? setFilters({ page: (filters.page || 1) + 1 }) : undefined}
                      disabled={(filters.page || 1) >= (transactionsData.meta.totalPages || 1) || isLoadingTransactions}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      <span className="sr-only">Go to next page</span>
                    </Button>
                  </PaginationItem>

                  {/* Last page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setFilters({ page: transactionsData.meta.totalPages })}
                      disabled={(filters.page || 1) >= (transactionsData.meta.totalPages || 1) || isLoadingTransactions}
                    >
                      <ChevronsRight className="h-4 w-4" />
                      <span className="sr-only">Go to last page</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
