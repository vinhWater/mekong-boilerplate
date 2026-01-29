'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useBrowserNotifications } from '@/lib/hooks/use-browser-notifications';

interface NotificationContextType {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { data: session, status } = useSession();
  const { permission, isSupported, requestPermission } = useBrowserNotifications();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  // Note: Auth token is handled automatically by NextAuth session
  // No need to store it manually as getSession() provides it when needed

  // Auto-request notification permission when user is authenticated
  useEffect(() => {
    if (
      status === 'authenticated' &&
      isSupported &&
      permission === 'default' &&
      !hasRequestedPermission
    ) {
      // Request permission after a short delay to avoid interrupting the login flow
      const timer = setTimeout(async () => {
        try {
          await requestPermission();
          setHasRequestedPermission(true);
        } catch (error) {
          console.error('Error requesting notification permission:', error);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, isSupported, permission, hasRequestedPermission, requestPermission]);

  const contextValue: NotificationContextType = {
    permission,
    isSupported,
    requestPermission,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}
