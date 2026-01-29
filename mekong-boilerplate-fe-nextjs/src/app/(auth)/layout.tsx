'use client';

import { useNextAuth } from '@/lib/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useNextAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that need to be accessible even when authenticated
  const allowedAuthenticatedPages = [
    '/logout', 
    '/auth/accept-invitation', 
    '/auth/verify', 
    '/auth/verify-request',
    '/auth/unauthorized', 
    '/auth/error',
    '/auth/maintenance'];

  useEffect(() => {
    // Let middleware handle the redirection to appropriate dashboard based on user role
    // EXCEPT for special pages that need to handle their own logic
    if (isAuthenticated && !isLoading && !allowedAuthenticatedPages.includes(pathname)) {
      // The middleware will handle redirecting to the appropriate page based on role
      router.refresh();
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Don't render anything while loading or if authenticated
  // EXCEPT for special pages that need to handle their own logic
  if ((isLoading || isAuthenticated) && !allowedAuthenticatedPages.includes(pathname)) {
    return null;
  }

  // All pages in the (auth) group now handle their own layout
  return (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="theme-auth"
      >
        {children}
      </ThemeProvider>
    );
}
