'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useNextAuth } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that protects routes requiring authentication
 * Shows a loading state while checking authentication
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useNextAuth();
  const router = useRouter();

  // While checking authentication status, show loading spinner
  if (isLoading) {
    return fallback || (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
