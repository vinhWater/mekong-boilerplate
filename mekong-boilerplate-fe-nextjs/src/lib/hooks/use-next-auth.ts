'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth-store";
import { useJobStore } from "../store/job-store";
import { toast } from "sonner";

/**
 * Primary authentication hook that combines custom session context with Zustand state
 * This should be the only hook used for authentication across the application
 */
export function useNextAuth() {
  // Get session directly from NextAuth
  const { data: session, status } = useSession();
  const sessionLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Get Zustand store state and actions
  const {
    isLoading: storeLoading,
    user,
    resetState,
    setUser,
  } = useAuthStore();

  // Get job store actions
  const { clearJobsOnSignout } = useJobStore();

  // Track previous user ID to detect user changes
  const previousUserIdRef = useRef<string | null>(null);

  // Sync NextAuth session data to Zustand store for caching
  useEffect(() => {
    if (session?.user) {
      const sessionUser = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
        managerId: session.user.managerId,
      };

      // Only update if user data has changed
      if (JSON.stringify(user) !== JSON.stringify(sessionUser)) {
        setUser(sessionUser);
      }
    } else if (user !== null) {
      // Clear user if session is gone
      setUser(null);
    }
  }, [session?.user, setUser, user]);

  // Monitor session changes and clear job store when user changes
  useEffect(() => {
    const currentUserId = session?.user?.id || null;

    // If we had a previous user and now have a different user (or no user)
    if (previousUserIdRef.current && previousUserIdRef.current !== currentUserId) {
      console.log(`[Auth] User changed from ${previousUserIdRef.current} to ${currentUserId}, clearing job store`);
      clearJobsOnSignout();
    }

    // Update the previous user ID
    previousUserIdRef.current = currentUserId;
  }, [session?.user?.id, clearJobsOnSignout]);

  // Show welcome message when user logs in
  const showWelcomeMessage = useCallback(() => {
    if (user?.name) {
      toast.success(`Welcome ${user.name}!`);
    }
  }, [user]);

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      await signIn("google");
      return true;
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Failed to sign in with Google");
      return false;
    }
  };

  // Login with Email (Magic Link)
  const loginWithEmail = async (email: string) => {
    try {
      await signIn("credentials", {
        email,
        redirect: true,
      });
      toast.success("Sign-in link sent to your email");
      return true;
    } catch (err) {
      console.error("Email login error:", err);
      toast.error("Failed to send sign-in link");
      return false;
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      // First reset the Zustand store
      resetState();
      // Clear job store to prevent showing previous user's jobs
      clearJobsOnSignout();
      // Then sign out from NextAuth
      await signOut({ callbackUrl: "/login" });
      toast.success("Signed out successfully");
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Failed to sign out");
    }
  };

  return {
    // Session state
    session,
    isAuthenticated,
    isLoading: sessionLoading || storeLoading,
    user, // Now synced from session via useEffect above

    // Auth actions
    loginWithGoogle,
    loginWithEmail,
    logout: handleLogout,
    showWelcomeMessage,
  };
}
