'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggler from '@/components/Header/ThemeToggler';

export default function VerifyRequestPage() {
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
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
            <p className="text-muted-foreground">
              We sent you a sign-in link. Click the link in your email to sign in.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Didn't receive the email?</strong>
              <br />
              Check your spam folder or try signing in again.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
