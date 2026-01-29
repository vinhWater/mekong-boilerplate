import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';

// Re-export User type for convenience
export type { User };

export interface AuthState {
  // Session state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;

  // Actions
  setSession: (isAuthenticated: boolean, user: User | null) => void;
  setUser: (user: User | null) => void;
  setLoadingState: (key: 'isLoading', value: boolean) => void;
  resetState: () => void;
}

// Initial state to use in both the store and the reset function
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      // Actions
      setSession: (isAuthenticated, user) =>
        set({ isAuthenticated, user, isLoading: false }),

      setUser: (user) =>
        set({ user }),

      setLoadingState: (key, value) =>
        set({ [key]: value }),

      resetState: () =>
        set({ ...initialState, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      // Only persist non-sensitive authentication state
      // Exclude sensitive TikTok data (applications, shops) for security
      partialize: () => ({
        // Note: Currently no non-sensitive data to persist
        // All TikTok applications and shops data contains sensitive information
        // and should be fetched from server on each session
      }),
    }
  )
);
