'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggler from '@/components/Header/ThemeToggler';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  // Check for maintenance mode error and redirect
  useEffect(() => {
    if (error === 'MAINTENANCE_MODE') {
      console.log('🔧 Redirecting to maintenance page...');
      router.push('/auth/maintenance');
    }
  }, [error, router]);

  let errorMessage = 'An error occurred during authentication.';
  
  switch (error) {
    case 'Signin':
      errorMessage = 'Try signing in with a different account.';
      break;
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
      errorMessage = 'There was a problem with your OAuth account.';
      break;
    case 'EmailSignin':
      errorMessage = 'The email could not be sent.';
      break;
    case 'CredentialsSignin':
      errorMessage = 'Sign in failed. Check the details you provided are correct.';
      break;
    case 'SessionRequired':
      errorMessage = 'Please sign in to access this page.';
      break;
    default:
      errorMessage = 'An unexpected error occurred.';
      break;
  }

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-red-500/10 p-3">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was a problem signing you in.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Error details:</strong>
          <br />
          {errorMessage}
        </p>
      </div>

      <Button asChild className="w-full">
        <Link href="/login">
          Return to Sign In
        </Link>
      </Button>
    </div>
  );
}

export default function AuthErrorPage() {
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

      <main className="grow flex items-center justify-center pt-[100px] pb-16 px-4">
        <Suspense fallback={
          <div className="w-full max-w-md space-y-6 text-center">
            <p className="text-lg mb-2">Loading...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        }>
          <AuthErrorContent />
        </Suspense>
      </main>
    </div>
  );
}
