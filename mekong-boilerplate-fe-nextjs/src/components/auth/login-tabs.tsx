'use client';

import { useState } from 'react';
import { useNextAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginTabs() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, isAuthenticated, isLoading } = useNextAuth();
  const router = useRouter();


  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare request body
      const requestBody: { email: string } = { email };

      // Use our custom API route to request a magic link
      const response = await fetch('/api/auth/request-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      // Check for maintenance mode
      if (response.status === 503 && data.error === 'MAINTENANCE') {
        router.push('/auth/maintenance');
        return;
      }

      if (response.ok && data.success) {
        toast.success('Sign-in link sent to your email');
        router.push('/auth/verify-request');
      } else {
        toast.error(data.error || 'Failed to send sign-in link. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to send sign-in link. Please try again.');
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
      <div className="flex items-center justify-center py-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-green-600 dark:text-green-500 mb-2">✓ You are signed in!</p>
        <Button
          onClick={() => router.push('/client/profile')}
          size="sm"
        >
          Go to Profile
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl">
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

      <TabsContent value="email" className="space-y-4">
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending sign-in link...' : 'Send Sign-in Link'}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="google" className="space-y-4">
        <p className="text-sm text-center text-muted-foreground">
          Click the button below to sign in with your Google account
        </p>
        <Button
          onClick={handleGoogleLogin}
          className="w-full"
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </TabsContent>
    </Tabs>
  );
}
