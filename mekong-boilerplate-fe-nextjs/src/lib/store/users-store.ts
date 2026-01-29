import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserFilters } from '@/types/user-filters';

export type UserLayoutType = 'table' | 'card';

interface UsersStore {
  // Filters for users list
  filters: UserFilters;
  setFilters: (newFilters: Partial<UserFilters>) => void;
  resetFilters: () => void;

  // Selected user IDs for bulk operations
  selectedUserIds: number[];
  setSelectedUserIds: (ids: number[]) => void;
  addSelectedUserId: (id: number) => void;
  removeSelectedUserId: (id: number) => void;
  toggleSelectAll: (allIds: number[], selected: boolean) => void;
  clearSelectedUserIds: () => void;

  // UI state
  isFiltersPanelOpen: boolean;
  setFiltersPanelOpen: (open: boolean) => void;

  // Layout state
  layout: UserLayoutType;
  setLayout: (layout: UserLayoutType) => void;

  // User detail view state
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;

  // Add Bonus Dialog state
  isBonusDialogOpen: boolean;
  setIsBonusDialogOpen: (open: boolean) => void;
  bonusDialogUserId: number | null;
  setBonusDialogUserId: (id: number | null) => void;
}

const defaultFilters: UserFilters = {
  page: 1,
  limit: 20,
  sortField: 'createdAt',
  sortDirection: 'desc',
};

export const useUsersStore = create<UsersStore>()(
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

      // Selected user IDs
      selectedUserIds: [],

      // Set selected user IDs
      setSelectedUserIds: (ids) => set({ selectedUserIds: ids }),

      // Add a user ID to selection
      addSelectedUserId: (id) => set((state) => ({
        selectedUserIds: [...state.selectedUserIds, id],
      })),

      // Remove a user ID from selection
      removeSelectedUserId: (id) => set((state) => ({
        selectedUserIds: state.selectedUserIds.filter((userId) => userId !== id),
      })),

      // Toggle select all users
      toggleSelectAll: (allIds, selected) => set({
        selectedUserIds: selected ? allIds : [],
      }),

      // Clear all selected user IDs
      clearSelectedUserIds: () => set({ selectedUserIds: [] }),

      // UI state
      isFiltersPanelOpen: false,
      setFiltersPanelOpen: (open) => set({ isFiltersPanelOpen: open }),

      // Layout state
      layout: 'table' as UserLayoutType,
      setLayout: (layout) => set({ layout }),

      // User detail view state
      selectedUserId: null,
      setSelectedUserId: (id) => set({ selectedUserId: id }),

      // Add Bonus Dialog state
      isBonusDialogOpen: false,
      setIsBonusDialogOpen: (open) => set({ isBonusDialogOpen: open }),
      bonusDialogUserId: null,
      setBonusDialogUserId: (id) => set({ bonusDialogUserId: id }),
    }),
    {
      name: 'users-store',
      partialize: (state) => ({
        filters: state.filters,
        layout: state.layout,
        isFiltersPanelOpen: state.isFiltersPanelOpen,
      }),
    }
  )
);
