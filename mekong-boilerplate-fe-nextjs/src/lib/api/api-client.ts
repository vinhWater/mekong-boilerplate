'use client';

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { signOut, getSession } from 'next-auth/react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/error-utils';

// API base URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * API client optimized for React Query
 * This client integrates directly with NextAuth for authentication
 */
export const apiClient = axios.create({
  baseURL: apiUrl,
  // Don't set default Content-Type to allow proper FormData handling
  withCredentials: true, // Important for cookies
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from config if provided
    const token = config.headers?.Authorization;
    if (token) {
      return config;
    }

    // No need to fetch session here as it should be provided by the caller
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling with automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors (token expired) with automatic refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Token expired. Refreshing token...');
      if (typeof window !== 'undefined') {
        // Mark this request as retried to prevent infinite loops
        originalRequest._retry = true;

        try {
          // Force NextAuth to refresh the session
          // This will trigger NextAuth's JWT callback which handles token refresh automatically
          const session = await getSession();

          if (!session) {
            throw new Error('No session available');
          }

          // Check if the session has an error (token refresh failed)
          if (session.error === 'RefreshAccessTokenError') {
            throw new Error('Token refresh failed in NextAuth');
          }

          if (!session.backendToken) {
            throw new Error('No access token available after refresh');
          }

          // Update the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${session.backendToken}`;
            // Retry the original request
            return apiClient.request(originalRequest);
          } else {
            throw new Error('No headers available for retry');
          }
        } catch (refreshError) {
          // Token refresh failed, sign out the user
          console.log('Token refresh failed. Signing out user.');
          toast.error('Your session has expired. Please sign in again.');
          await signOut({ callbackUrl: '/login' });
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle other API errors with user-friendly messages
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      // Handle 503 Service Unavailable with maintenance message
      if (
        status === 503 &&
        data?.message === 'System is under maintenance. Please try again later.'
      ) {
        // Force sign out and redirect to maintenance page
        if (typeof window !== 'undefined') {
          // Sign out to clear session and prevent access to cached pages
          await signOut({ redirect: false });
          window.location.href = '/auth/maintenance';
        }
        return Promise.reject(error);
      }

      // Show appropriate error messages based on status code
      switch (status) {
        case 400:
          toast.error(getErrorMessage(data, 'Invalid request. Please check your data.'));
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('The requested resource was not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        case 503:
          toast.error('Service unavailable. Please try again later.');
          break;
        default:
          if (status >= 400) {
            toast.error(getErrorMessage(data, 'An error occurred. Please try again.'));
          }
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your connection and try again.');
    } else {
      // Something happened in setting up the request
      toast.error('An unexpected error occurred. Please try again.');
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API request function for React Query
 * @param config Axios request configuration
 * @returns Promise with the response data
 */
export const apiRequest = async <T>(
  config: AxiosRequestConfig & { token?: string }
): Promise<T> => {
  try {
    // Check if data is FormData
    const isFormData = config.data instanceof FormData;

    // Set default headers
    config.headers = {
      ...config.headers,
    };

    // Add token to headers if provided
    if (config.token) {
      config.headers.Authorization = `Bearer ${config.token}`;
    }

    // Set Content-Type based on data type
    if (isFormData) {
      // For FormData, don't set Content-Type - let browser set it with boundary
      // Remove any existing Content-Type header
      delete config.headers['Content-Type'];
    } else {
      // For non-FormData, set application/json
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    // Let the interceptor handle the error first
    throw error;
  }
};

/**
 * Helper function to create a query key factory for a specific resource
 * This helps with proper cache invalidation in React Query
 * @param resource The API resource name (e.g., 'products', 'categories')
 * @returns A function that generates query keys
 */
export const createQueryKeys = (resource: string) => {
  return {
    all: [resource] as const,
    lists: () => [...createQueryKeys(resource).all, 'list'] as const,
    list: (filters: Record<string, any> = {}) => [...createQueryKeys(resource).lists(), { filters }] as const,
    details: () => [...createQueryKeys(resource).all, 'detail'] as const,
    detail: (id: number | string) => [...createQueryKeys(resource).details(), id] as const,
  };
};
