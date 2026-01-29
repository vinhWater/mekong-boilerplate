"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggler from '@/components/Header/ThemeToggler';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) {
      console.log('[AuthVerify] Already verified, skipping duplicate call');
      return;
    }

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    console.log('[AuthVerify] Starting verification...', {
      email,
      hasToken: !!token
    });

    const verifyLogin = async () => {
      if (hasVerified.current) {
        console.log('[AuthVerify] Already verified in verifyLogin, skipping');
        return;
      }

      hasVerified.current = true;
      console.log('[AuthVerify] Setting hasVerified to true');

      if (!email || !token) {
        console.error('[AuthVerify] Missing email or token');
        toast.error("Invalid link");
        setLoading(false);
        router.replace("/login");
        return;
      }

      try {
        // Sign out existing session first
        const existingSession = await fetch('/api/auth/session').then(r => r.json());
        if (existingSession?.user) {
          console.log('[AuthVerify] Existing session found, signing out first...');
          await signOut({ redirect: false });
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('[AuthVerify] Attempting signIn with credentials...');
        const result = await signIn("credentials", {
          email,
          magicToken: token,
          redirect: false
        });

        console.log('[AuthVerify] SignIn result:', {
          success: !result?.error,
          error: result?.error
        });

        if (result?.error) {
          console.error('[AuthVerify] Login failed:', result.error);
          toast.error("Sign in failed or link expired.");
          setLoading(false);
          router.replace("/login");
          return;
        }

        // Wait for session to be established
        await new Promise(resolve => setTimeout(resolve, 300));

        // Get fresh session with metadata
        const freshSession = await fetch('/api/auth/session').then(r => r.json());
        console.log('[AuthVerify] Fresh session retrieved:', {
          hasMetadata: !!(freshSession as any)?.metadata,
          metadataType: (freshSession as any)?.metadata?.type,
          role: freshSession?.user?.role,
          managerId: freshSession?.user?.managerId,
        });

        toast.success("Signed in successfully!");

        // Check for team invitation metadata
        const metadata = (freshSession as any)?.metadata;

        if (metadata?.type === 'team_invitation') {
          // ✅ Redirect to dedicated accept-invitation page
          // This page uses the same pattern as test-update page which is proven to work
          console.log('[AuthVerify] Team invitation detected, redirecting to accept-invitation page...');
          setLoading(false);
          router.replace('/auth/accept-invitation');
          return;
        }

        // Default redirect based on role
        const redirectPath = freshSession?.user?.role === 'admin'
          ? '/admin/dashboard'
          : '/client/profile';
        
        console.log('[AuthVerify] Redirecting to default path:', redirectPath);
        setLoading(false);
        router.replace(redirectPath);

      } catch (error) {
        console.error("[AuthVerify] Verification error:", error);
        toast.error("An error occurred during verification.");
        setLoading(false);
        router.replace("/login");
      }
    };

    verifyLogin();
  }, [searchParams, router]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex items-center justify-center py-10">
        <div className="text-center">
          <p className="text-lg mb-2">Verifying your account...</p>
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
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
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}