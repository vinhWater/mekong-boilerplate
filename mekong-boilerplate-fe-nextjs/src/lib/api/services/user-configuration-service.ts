'use client';

import { apiRequest } from '@/lib/api/api-client';
import {
    UserConfiguration,
    CreateUserConfigurationDto,
    UpdateUserConfigurationDto,
} from '@/types/user-configuration';
import {
    getMockUserConfigurations,
    createMockUserConfiguration,
    updateMockUserConfiguration,
    deleteMockUserConfiguration,
    toggleMockUserConfiguration,
} from '@/lib/api/mock/user-configuration.mock';

// Check if mock data should be used
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Fetch all configurations for the current user
 * Only available for MANAGER role
 */
export const getUserConfigurations = async (token: string): Promise<UserConfiguration[]> => {
    if (useMockData) {
        return getMockUserConfigurations();
    }
    return apiRequest<UserConfiguration[]>({
        url: '/user-configurations',
        method: 'GET',
        token,
    });
};

/**
 * Create a new user configuration
 */
export const createUserConfiguration = async (
    data: CreateUserConfigurationDto,
    token: string
): Promise<UserConfiguration> => {
    if (useMockData) {
        return createMockUserConfiguration(data);
    }
    return apiRequest<UserConfiguration>({
        url: '/user-configurations',
        method: 'POST',
        data,
        token,
    });
};

/**
 * Update an existing user configuration
 */
export const updateUserConfiguration = async (
    id: number,
    data: UpdateUserConfigurationDto,
    token: string
): Promise<UserConfiguration> => {
    if (useMockData) {
        return updateMockUserConfiguration(id, data);
    }
    return apiRequest<UserConfiguration>({
        url: `/user-configurations/${id}`,
        method: 'PATCH',
        data,
        token,
    });
};

/**
 * Delete a user configuration
 */
export const deleteUserConfiguration = async (id: number, token: string): Promise<void> => {
    if (useMockData) {
        return deleteMockUserConfiguration(id);
    }
    return apiRequest<void>({
        url: `/user-configurations/${id}`,
        method: 'DELETE',
        token,
    });
};

/**
 * Toggle configuration active status
 */
export const toggleUserConfiguration = async (id: number, token: string): Promise<UserConfiguration> => {
    if (useMockData) {
        return toggleMockUserConfiguration(id);
    }
    return apiRequest<UserConfiguration>({
        url: `/user-configurations/${id}/toggle`,
        method: 'PATCH',
        token,
    });
};
