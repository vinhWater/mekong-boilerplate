import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TransactionFilters } from '@/types/transaction';

interface TransactionsStore {
  // Filters for transactions list
  filters: TransactionFilters;
  setFilters: (newFilters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;

  // UI state
  isFiltersPanelOpen: boolean;
  setFiltersPanelOpen: (open: boolean) => void;
}

const defaultFilters: TransactionFilters = {
  page: 1,
  limit: 20,
  sortField: 'createdAt',
  sortDirection: 'desc',
};

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set) => ({
      // Default filters
      filters: defaultFilters,

      // Update filters
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      // Reset filters to default
      resetFilters: () => set({ filters: defaultFilters }),

      // UI state
      isFiltersPanelOpen: false,
      setFiltersPanelOpen: (open) => set({ isFiltersPanelOpen: open }),
    }),
    {
      name: 'transactions-store',
      partialize: (state) => ({
        filters: state.filters,
        isFiltersPanelOpen: state.isFiltersPanelOpen,
      }),
    },
  ),
);
