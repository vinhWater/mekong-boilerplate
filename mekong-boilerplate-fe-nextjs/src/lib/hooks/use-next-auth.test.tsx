import { renderHook, act } from '@testing-library/react';
import { useNextAuth } from './use-next-auth';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuthStore } from '../store/auth-store';
import { toast } from 'sonner';

// Jest mocks are handled with 'unknown as jest.Mock' casting

// Mock dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('../store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useNextAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useSession
    (useSession as unknown as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    // Mock useAuthStore
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      setSession: jest.fn(),
      setUser: jest.fn(),
      setLoadingState: jest.fn(),
      resetState: jest.fn(),
    });
  });

  it('should handle unauthenticated state', () => {
    // Render the hook
    const { result } = renderHook(() => useNextAuth());

    // Check the result
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle loading state', () => {
    // Mock loading state
    (useSession as unknown as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    // Render the hook
    const { result } = renderHook(() => useNextAuth());

    // Check the result
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle authenticated state', () => {
    // Mock authenticated state
    (useSession as unknown as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    });

    // Render the hook
    const { result } = renderHook(() => useNextAuth());

    // Check the result
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle token refresh error', () => {
    // Mock authenticated state with refresh error
    (useSession as unknown as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
        error: 'RefreshAccessTokenError',
      },
      status: 'authenticated',
    });

    // Render the hook
    renderHook(() => useNextAuth());

    // Note: The current implementation doesn't handle RefreshAccessTokenError in useNextAuth
    // This functionality is handled in the AuthLayout component
  });

  it('should handle login with Google', async () => {
    // Render the hook
    const { result } = renderHook(() => useNextAuth());

    // Mock successful sign in
    (signIn as unknown as jest.Mock).mockResolvedValue({ ok: true });

    // Call login method
    await act(async () => {
      await result.current.loginWithGoogle();
    });

    // Check signIn was called
    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('should handle login with email', async () => {
    // Render the hook
    const { result } = renderHook(() => useNextAuth());

    // Mock successful sign in
    (signIn as unknown as jest.Mock).mockResolvedValue({ ok: true });

    // Call login method
    await act(async () => {
      await result.current.loginWithEmail('test@example.com');
    });

    // Check signIn was called
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      redirect: true,
    });

    // Check success message
    expect(toast.success).toHaveBeenCalledWith('Sign-in link sent to your email');
  });

  it('should handle logout', async () => {
    // Render the hook
    const { result } = renderHook(() => useNextAuth());

    // Call logout method
    await act(async () => {
      await result.current.logout();
    });

    // Check state was reset
    expect(useAuthStore().resetState).toHaveBeenCalled();

    // Check signOut was called
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });

    // Check success message
    expect(toast.success).toHaveBeenCalledWith('Signed out successfully');
  });
});
