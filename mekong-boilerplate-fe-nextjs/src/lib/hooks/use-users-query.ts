'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, createQueryKeys } from '../api/api-client';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { UserFilters } from '@/types/user-filters';

// Define types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  image?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  isActive?: boolean;
}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> {
  password?: string;
}

// Create query keys for users
export const userKeys = createQueryKeys('users');

interface UsersResponse {
  data: User[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    itemCount: number;
  };
}

/**
 * Hook to fetch all users with pagination and filtering
 */
export function useUsers(filters: UserFilters = {}) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => apiRequest<UsersResponse>({
      url: '/users',
      method: 'GET',
      params: filters,
      token: session?.backendToken
    }),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch current user's profile
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: userKeys.detail('me'),
    queryFn: () => apiRequest<User>({
      url: '/users/me',
      method: 'GET',
      token: session?.backendToken
    }),
    enabled: isAuthenticated,
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: number | string) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => apiRequest<User>({
      url: `/users/${id}`,
      method: 'GET',
      token: session?.backendToken
    }),
    enabled: isAuthenticated && !!id,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  
  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      return await apiRequest<User>({
        url: '/users',
        method: 'POST',
        data,
        token: session?.backendToken
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      console.error('Create user error:', error);
      toast.error(error?.response?.data?.message || 'Failed to create user');
    },
  });
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number | string } & UpdateUserInput) => {
      return await apiRequest<User>({
        url: `/users/${id}`,
        method: 'PUT',
        data,
        token: session?.backendToken
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      console.error('Update user error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update user');
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  
  return useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest({
        url: `/users/${id}`,
        method: 'DELETE',
        token: session?.backendToken
      });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete user error:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    },
  });
}

/**
 * Hook to update current user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name?: string; email?: string; password?: string; currentPassword: string }) => 
      apiRequest<User>({
        url: '/users/me',
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail('me') });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Update profile error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    },
  });
}

// Bonus transaction types
export interface CreateBonusTransactionInput {
  userId: number;
  amount: number;
  description: string;
}

export interface TransactionResponse {
  id: number;
  type: string;
  amount: string;
  balanceAfter: string | null;
  balanceBefore: string | null;
  paymentMethod: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook to create a bonus transaction for a user (Admin only)
 */
export function useCreateBonusTransaction() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: CreateBonusTransactionInput) => apiRequest<TransactionResponse>({
      url: '/transactions/bonus',
      method: 'POST',
      data,
      token: session?.backendToken
    }),
    onSuccess: (_, variables) => {
      // Invalidate users queries to refresh balance
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });

      toast.success(`Bonus of $${variables.amount} added successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create bonus transaction');
    },
  });
}
