'use client';

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { UserRole } from '@/types/auth';
import { ThemeProvider } from "@/components/providers/theme-provider";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin layout component that handles authentication, role-based access, and data fetching
 * This is the top-level component for all admin pages
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  // Get session directly from NextAuth
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Redirect to login if not authenticated and not loading
  if (!isAuthenticated && !isLoading) {
    redirect('/login');
  }

  // Redirect to unauthorized page if user doesn't have admin role
  if (isAuthenticated && !isLoading && session?.user?.role !== UserRole.ADMIN) {
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

  // Render children once authenticated with admin role
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="theme-admin"
    >
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
}

