"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/auth-store";
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggler from '@/components/Header/ThemeToggler';

function LogoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { resetState } = useAuthStore();

  console.log('[LogoutPage] Component mounted');

  useEffect(() => {
    console.log('[LogoutPage] useEffect triggered');
    const performLogout = async () => {
      try {
        console.log('[Logout] Starting logout process...');
        
        // Get callback URL from search params
        const callbackUrl = searchParams.get('callbackUrl');
        
        // Check if user is actually logged in
        const session = await getSession();
        
        if (session) {
          console.log('[Logout] User session found, signing out...');
          
          // Reset Zustand store first
          resetState();
          
          // Sign out from NextAuth without redirect
          await signOut({ redirect: false });
          
          console.log('[Logout] Signout completed');
        } else {
          console.log('[Logout] No active session found');
        }
        
        // Small delay to ensure signout is complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to callback URL or default login page
        const redirectUrl = callbackUrl || '/login';
        console.log('[Logout] Redirecting to:', redirectUrl);
        
        router.replace(redirectUrl);
        
      } catch (error) {
        console.error('[Logout] Error during logout:', error);
        // Even if there's an error, redirect to login
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    performLogout();
  }, [searchParams, router, resetState]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex items-center justify-center py-10">
        <div className="text-center">
          <p className="text-lg mb-2">Signing out...</p>
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LogoutPage() {
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
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="flex items-center justify-center py-10">
              <div className="text-center">
                <p className="text-lg mb-2">Loading...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        }>
          <LogoutContent />
        </Suspense>
      </main>
    </div>
  );
}
