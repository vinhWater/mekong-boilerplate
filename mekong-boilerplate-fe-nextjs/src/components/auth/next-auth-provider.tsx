'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthLayout } from "./auth-layout";
import { QueryProvider } from "@/components/providers/query-provider";

interface NextAuthProviderProps {
  children: ReactNode;
}

/**
 * Global authentication provider that uses NextAuth SessionProvider directly
 * with optimized session management
 *
 * Session Sync Strategy:
 * - refetchOnWindowFocus: true - Ensures tabs sync when user switches between them
 * - refetchInterval: 0 - No automatic polling to reduce API calls
 * - When update() is called in one tab, other tabs will sync when focused
 */
export function NextAuthProvider({ children }: NextAuthProviderProps) {
  return (
    <SessionProvider
      // ✅ Enable refetch on window focus for multi-tab synchronization
      refetchOnWindowFocus={true}
      // Disable automatic polling to reduce API calls
      refetchInterval={0}
      // Disable refetch when offline
      refetchWhenOffline={false}
    >
      <QueryProvider>
        <AuthLayout>
          {children}
        </AuthLayout>
      </QueryProvider>
    </SessionProvider>
  );
}
