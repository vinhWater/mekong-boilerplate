'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createQueryKeys } from '../api/api-client';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
    getUserConfigurations,
    createUserConfiguration,
    updateUserConfiguration,
    deleteUserConfiguration,
    toggleUserConfiguration,
} from '../api/services/user-configuration-service';
import {
    UserConfiguration,
    CreateUserConfigurationDto,
    UpdateUserConfigurationDto,
} from '@/types/user-configuration';

// Create query keys for user configurations
export const userConfigurationKeys = createQueryKeys('user-configurations');

/**
 * Hook to fetch current user's configurations
 * Only available for MANAGER role
 */
export function useUserConfigurations() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return useQuery({
        queryKey: userConfigurationKeys.lists(),
        queryFn: () => getUserConfigurations(session?.backendToken!),
        enabled: isAuthenticated && session?.user?.role === 'manager',
    });
}

/**
 * Hook to create a new user configuration
 */
export function useCreateUserConfiguration() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (data: CreateUserConfigurationDto) => {
            return createUserConfiguration(data, session?.backendToken!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userConfigurationKeys.lists() });
            toast.success('Configuration created successfully');
        },
        onError: (error: any) => {
            console.error('Create configuration error:', error);
            toast.error(error?.response?.data?.message || 'Failed to create configuration');
        },
    });
}

/**
 * Hook to update an existing user configuration
 */
export function useUpdateUserConfiguration() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async ({ id, ...data }: { id: number } & UpdateUserConfigurationDto) => {
            return updateUserConfiguration(id, data, session?.backendToken!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userConfigurationKeys.lists() });
            toast.success('Configuration updated successfully');
        },
        onError: (error: any) => {
            console.error('Update configuration error:', error);
            toast.error(error?.response?.data?.message || 'Failed to update configuration');
        },
    });
}

/**
 * Hook to delete a user configuration
 */
export function useDeleteUserConfiguration() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (id: number) => {
            return deleteUserConfiguration(id, session?.backendToken!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userConfigurationKeys.lists() });
            toast.success('Configuration deleted successfully');
        },
        onError: (error: any) => {
            console.error('Delete configuration error:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete configuration');
        },
    });
}

/**
 * Hook to toggle configuration active status
 */
export function useToggleUserConfiguration() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (id: number) => {
            return toggleUserConfiguration(id, session?.backendToken!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userConfigurationKeys.lists() });
            toast.success('Configuration status updated');
        },
        onError: (error: any) => {
            console.error('Toggle configuration error:', error);
            toast.error(error?.response?.data?.message || 'Failed to update configuration status');
        },
    });
}
