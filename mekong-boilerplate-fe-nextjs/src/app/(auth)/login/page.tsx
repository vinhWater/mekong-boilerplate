'use client';

import { useState } from 'react';
import { useNextAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggler from '@/components/Header/ThemeToggler';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, isLoading } = useNextAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/request-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Check for maintenance mode
      if (response.status === 503 && data.error === 'MAINTENANCE') {
        router.push('/auth/maintenance');
        return;
      }

      if (response.ok && data.success) {
        toast.success('Sign-in link has been sent to your email');
        router.push('/auth/verify-request');
      } else {
        toast.error(data.error || 'Could not send sign-in link. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Could not send sign-in link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white dark:bg-dark">
        <div className="flex flex-col items-center justify-center py-20 px-4">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
           <p className="mt-4 text-body-color">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col overflow-hidden bg-white dark:bg-dark">
      {/* Simple Header */}
      <header className="header left-0 top-0 z-40 flex w-full items-center absolute bg-transparent">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="w-60 max-w-full">
              <Link href="/" className="header-logo block w-full py-4">
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

      <main className="grow flex items-center justify-center pt-20 pb-8">
        <div className="container px-4">
          <div className="flex flex-wrap items-center -mx-4 justify-center gap-8">
            
            {/* Left Column: Branding & Value Props (Hidden on mobile/tablet) */}
            <div className="hidden lg:block w-full lg:w-auto px-4 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="max-w-[450px]">
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                   <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                   </svg>
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Official API Partner
                   </span>
                </div>
                <h1 className="mb-4 text-4xl font-bold leading-tight text-black dark:text-white sm:text-5xl">
                   Optimal TikTok Shop US Operation Platform
                </h1>
                <p className="mb-4 text-lg text-body-color leading-relaxed">
                   TokExpert – TikTok Shop US operation ecosystem with API Partner standard, completely eliminates Proxy/VPS barriers.
                </p>
                
                <ul className="space-y-4">
                   <li className="flex items-center gap-3 text-black dark:text-white font-medium">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                         <CheckCircle className="h-4 w-4" />
                      </div>
                      Official API connection - Absolutely secure
                   </li>
                   <li className="flex items-center gap-3 text-black dark:text-white font-medium">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                         <CheckCircle className="h-4 w-4" />
                      </div>
                      Manage multiple shops on one screen
                   </li>
                   <li className="flex items-center gap-3 text-black dark:text-white font-medium">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                         <CheckCircle className="h-4 w-4" />
                      </div>
                      Automate listing & order processing
                   </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Login Card */}
            <div className="w-full max-w-md lg:w-[450px] px-4 animate-in fade-in slide-in-from-right-8 duration-700">
              <Card className="border-white/10 dark:border-white/5 bg-white/70 dark:bg-white/3 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
                <CardHeader className="space-y-2 text-center pb-8">
                  <CardTitle className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-body-color text-base">
                    Sign in to manage your TikTok Shop operations
                  </CardDescription>
                </CardHeader>
                
                <Tabs defaultValue="email" className="w-full">
                  <div className="px-6 pt-8">
                    <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl">
                      <TabsTrigger 
                        value="email" 
                        className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all py-3"
                      >
                        Email
                      </TabsTrigger>
                      <TabsTrigger 
                        value="google" 
                        className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all py-3"
                      >
                        Google
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="email" className="mt-0 p-8 space-y-6 animate-in slide-in-from-left-4 duration-300">
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-14 bg-white/50 dark:bg-dark/50 border-gray-200 dark:border-white/10 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl px-5"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white transition-all duration-300 shadow-lg shadow-primary/20 rounded-2xl" 
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-b-white"></div>
                            Sending link...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                             Send Sign-in Link <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="google" className="mt-0 p-8 space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-5">
                      <p className="text-sm text-body-color leading-relaxed px-4">
                        Click the button below to sign in with your Google account
                      </p>
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full h-14 text-lg font-semibold border-gray-200 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 rounded-2xl hover:border-primary/50"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/50 border-b-primary"></div>
                        ) : (
                          <svg className="h-6 w-6" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        )}
                        {loading ? 'Signing in...' : 'Continue with Google'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
