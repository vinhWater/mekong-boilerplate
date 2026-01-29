'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/lib/store/auth-store';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * A layout component that handles authentication state and data fetching
 * Automatically syncs session data with Zustand store
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  // Get session directly from NextAuth
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Get Zustand store actions
  const { setSession, resetState } = useAuthStore();

  // Sync session with Zustand store
  useEffect(() => {
    if (isAuthenticated && session?.user) {
      // Check if there was an error refreshing the token
      if (session.error === "RefreshAccessTokenError") {
        console.error("Failed to refresh access token");
        resetState();
        return;
      }

      // When authenticated, update our store with user data
      const storeUser = {
        id: Number(session.user.id) || 0,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      };

      setSession(true, storeUser);
    } else if (!isAuthenticated) {
      // When not authenticated, reset our store
      resetState();
    }
  }, [isAuthenticated, session, setSession, resetState]);

  return <>{children}</>;
}
