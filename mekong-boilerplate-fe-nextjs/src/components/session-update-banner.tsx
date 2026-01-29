'use client';

import { useSession, signOut } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

/**
 * SessionUpdateBanner Component
 *
 * Displays a blocking banner for users with outdated sessions that require re-login.
 *
 * Triggers re-login when:
 * 1. User has old 'client' role (migration to 'manager'/'member')
 * 2. User has 'manager' or 'member' role but missing managerId field (incomplete session data)
 *
 * This is part of the Force Re-login approach for handling schema migrations
 * without backward compatibility.
 * 
 * Note: Uses hardcoded English text since this only appears in protected routes
 * which don't have multi-language support.
 */
export function SessionUpdateBanner() {
  const { data: session } = useSession();

  // Check if user has an old session with 'client' role
  // TypeScript warning is expected here - we're intentionally checking for the old 'client' role
  // that existed before the migration to 'manager'/'member' roles
  const hasOldClientRole = (session?.user?.role as string) === 'client';

  // Note: managerId check removed because User entity doesn't have this field in current schema
  // If you need manager-member relationships in the future, add managerId column to users table first

  const hasOldSession = hasOldClientRole;

  if (!hasOldSession) {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Session Update Required</AlertTitle>
          <AlertDescription>
            <p className="mb-4">
              Your session needs to be updated. Please sign in again to continue.
            </p>
            <Button
              onClick={handleLogout}
              className="w-full"
              variant="destructive"
            >
              Log Out and Continue
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
