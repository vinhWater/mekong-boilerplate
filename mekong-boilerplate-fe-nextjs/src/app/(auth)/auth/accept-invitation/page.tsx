"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggler from '@/components/Header/ThemeToggler';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Wait for session to be loaded
    if (status === "loading") {
      console.log('[AcceptInvitation] Session is loading...');
      return;
    }

    if (!session) {
      console.log('[AcceptInvitation] No session found, redirecting to login');
      router.replace("/login");
      return;
    }

    // Prevent double execution
    if (hasProcessed.current) {
      console.log('[AcceptInvitation] Already processed, skipping');
      return;
    }

    const metadata = (session as any)?.metadata;

    if (!metadata || metadata.type !== 'team_invitation') {
      console.log('[AcceptInvitation] No invitation metadata, redirecting');
      router.replace("/client/profile");
      return;
    }

    // Mark as processed immediately to prevent double execution
    hasProcessed.current = true;

    const processInvitation = async () => {
      console.log('[AcceptInvitation] Processing invitation...', metadata);

      try {
        // Step 1: Accept the invitation via backend API
        console.log('[AcceptInvitation] Step 1: Calling accept-invitation API...');
        const acceptResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/team/members/accept-invitation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(session as any).backendToken}`,
            },
            body: JSON.stringify({ managerId: metadata.managerId }),
          },
        );

        if (!acceptResponse.ok) {
          const errorData = await acceptResponse.json();
          throw new Error(errorData.message || 'Failed to accept invitation');
        }

        const acceptData = await acceptResponse.json();
        console.log('[AcceptInvitation] ✅ Invitation accepted successfully:', acceptData);
        toast.success('Team invitation accepted!');

        // Step 2: Update session using NextAuth update() - same pattern as test-update page
        console.log('[AcceptInvitation] Step 2: Updating session via update()...');
        console.log('[AcceptInvitation] Session before update:', {
          role: (session as any)?.user?.role,
          managerId: (session as any)?.user?.managerId,
        });

        const updateResult = await update();
        console.log('[AcceptInvitation] Update result:', updateResult);

        // Step 3: Wait and verify session was updated
        await new Promise(resolve => setTimeout(resolve, 500));

        const freshSession = await fetch('/api/auth/session').then(r => r.json());
        console.log('[AcceptInvitation] ✅ Session after update:', {
          role: freshSession?.user?.role,
          managerId: freshSession?.user?.managerId,
          hasMetadata: !!(freshSession as any)?.metadata,
        });

        // Step 4: Redirect to appropriate page
        const redirectUrl = metadata.redirectUrl || '/client/profile';
        console.log('[AcceptInvitation] Step 4: Redirecting to:', redirectUrl);
        
        setLoading(false);
        router.replace(redirectUrl);

      } catch (err: any) {
        console.error('[AcceptInvitation] ❌ Error:', err);
        toast.error(err.message || 'Failed to accept invitation');
        setLoading(false);
        // Redirect to profile even on error
        router.replace('/client/profile');
      }
    };

    processInvitation();
  }, [session, status, update, router]);

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
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Processing Invitation</h2>
              <p className="text-muted-foreground mb-4">
                Please wait while we set up your team access...
              </p>
              {loading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

