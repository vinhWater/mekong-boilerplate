'use client';

import { Button } from '@/components/ui/button';
import { useNextAuth } from '@/lib/hooks/use-next-auth';
import { UserRole } from '@/types/auth';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggler from '@/components/Header/ThemeToggler';

export default function UnauthorizedPage() {
  const { session, logout } = useNextAuth();
  const userRole = session?.user?.role;
  
  // Determine where to redirect based on user role
  const homeLink = userRole === UserRole.ADMIN
    ? '/admin/dashboard'
    : userRole === UserRole.MANAGER || userRole === UserRole.MEMBER
      ? '/client/profile'
      : '/login';
  
  return (
    <div className="relative z-10 flex min-h-screen flex-col overflow-hidden bg-white dark:bg-dark">
      {/* Simple Header */}
      <header className="header left-0 top-0 z-40 flex w-full items-center absolute bg-transparent">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="w-60 max-w-full">
              <Link href="/" className="header-logo block w-full py-8">
                <Image
                  src="https://placehold.co/200x50/1e293b/38bdf8?text=Logo"
                  alt="TikTok Shop Automation"
                  width={140}
                  height={30}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo-2-white.svg"
                  alt="TikTok Shop Automation"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex items-center justify-end">
              <ThemeToggler />
            </div>
          </div>
        </div>
      </header>
      
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-50"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <main className="grow flex flex-col items-center justify-center pt-[100px] pb-16 text-center px-4">
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Access Denied</h1>
            <p className="text-muted-foreground">
              You don&apos;t have permission to access this page. This area is restricted to authorized users only.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild variant="default">
              <Link href={homeLink}>
                Return to Home
              </Link>
            </Button>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
