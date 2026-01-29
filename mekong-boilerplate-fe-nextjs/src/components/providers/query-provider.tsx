'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * React Query provider with optimized configuration
 * This component should wrap the entire application to provide React Query context
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient in component to ensure it's created on client side
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: (failureCount, error: any) => {
            // Allow retry on 401 unauthorized since we now handle token refresh
            // Don't retry on other client errors (4xx except 401)
            if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 401) {
              return false;
            }
            // Retry up to 3 times for network errors and 5xx errors
            return failureCount < 3;
          },
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
        },
        mutations: {
          retry: (failureCount, error: any) => {
            // Don't retry mutations on client errors (4xx)
            if (error?.response?.status >= 400 && error?.response?.status < 500) {
              return false;
            }
            // Retry mutations up to 2 times for network errors and 5xx errors
            return failureCount < 2;
          },
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
