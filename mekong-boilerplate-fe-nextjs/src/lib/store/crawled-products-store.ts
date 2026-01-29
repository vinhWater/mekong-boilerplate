import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CrawledProductFilters } from '@/types/crawled-product';

export type LayoutType = 'table' | 'thumbnail';

interface CrawledProductsStore {
  // Filters for crawled products list
  filters: CrawledProductFilters;
  setFilters: (newFilters: Partial<CrawledProductFilters>) => void;
  resetFilters: () => void;

  // Selected product IDs for bulk operations
  selectedProductIds: number[];
  setSelectedProductIds: (ids: number[]) => void;
  addSelectedProductId: (id: number) => void;
  removeSelectedProductId: (id: number) => void;
  toggleSelectAll: (allIds: number[], selected: boolean) => void;
  clearSelectedProductIds: () => void;

  // UI state
  isFiltersPanelOpen: boolean;
  setFiltersPanelOpen: (open: boolean) => void;

  // Layout state
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

const defaultFilters: CrawledProductFilters = {
  page: 1,
  limit: 20,
  sortField: 'updatedAt',
  sortDirection: 'desc',
  isPublic: true, // Show team's private products + all public products
};

export const useCrawledProductsStore = create<CrawledProductsStore>()(
  persist(
    (set) => ({
      // Default filters
      filters: defaultFilters,

      // Update filters
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),

      // Reset filters to default
      resetFilters: () => set({ filters: defaultFilters }),

      // Selected product IDs
      selectedProductIds: [],

      // Set selected product IDs
      setSelectedProductIds: (ids) => set({ selectedProductIds: ids }),

      // Add a product ID to selection
      addSelectedProductId: (id) => set((state) => ({
        selectedProductIds: [...state.selectedProductIds, id],
      })),

      // Remove a product ID from selection
      removeSelectedProductId: (id) => set((state) => ({
        selectedProductIds: state.selectedProductIds.filter((productId) => productId !== id),
      })),

      // Toggle select all products
      toggleSelectAll: (allIds, selected) => set({
        selectedProductIds: selected ? allIds : [],
      }),

      // Clear all selected product IDs
      clearSelectedProductIds: () => set({ selectedProductIds: [] }),

      // UI state
      isFiltersPanelOpen: false,
      setFiltersPanelOpen: (open) => set({ isFiltersPanelOpen: open }),

      // Layout state
      layout: 'thumbnail' as LayoutType,
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: 'crawled-products-store',
      // Only persist layout preference, not temporary UI state
      partialize: (state) => ({ layout: state.layout }),
    }
  )
);
