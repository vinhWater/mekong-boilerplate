'use client';

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { UserRole } from '@/types/auth';
import { ClientLayout } from '@/components/layout';

interface ClientRootLayoutProps {
  children: ReactNode;
}

/**
 * Client layout component that handles authentication and role-based access
 * This is the top-level component for all client pages
 */
import { ThemeProvider } from "@/components/providers/theme-provider";

// ... existing imports

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  // Get session directly from NextAuth
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Redirect to login if not authenticated and not loading
  if (!isAuthenticated && !isLoading) {
    redirect('/login');
  }

  // Redirect to unauthorized page if user doesn't have manager or member role
  if (isAuthenticated && !isLoading &&
      session?.user?.role !== UserRole.MANAGER &&
      session?.user?.role !== UserRole.MEMBER &&
      session?.user?.role !== UserRole.ADMIN) {
    redirect('/auth/unauthorized');
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Render children once authenticated with appropriate role using ClientLayout
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="theme-seller"
    >
      <ClientLayout>{children}</ClientLayout>
    </ThemeProvider>
  );
}
