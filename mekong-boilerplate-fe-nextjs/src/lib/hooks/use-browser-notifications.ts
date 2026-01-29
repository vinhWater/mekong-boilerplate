'use client';

import { useState, useEffect, useCallback } from 'react';
import { browserNotificationService } from '@/lib/services/browser-notification.service';

export interface UseBrowserNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, body: string, options?: any) => Promise<Notification | null>;
  showSuccess: (title: string, body: string, options?: any) => Promise<Notification | null>;
  showError: (title: string, body: string, options?: any) => Promise<Notification | null>;
  showInfo: (title: string, body: string, options?: any) => Promise<Notification | null>;
}

/**
 * Hook for managing browser notifications
 */
export function useBrowserNotifications(): UseBrowserNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Only run on client side
    setIsSupported(browserNotificationService.isSupported());
    setPermission(browserNotificationService.getPermission());
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const newPermission = await browserNotificationService.requestPermission();
    setPermission(newPermission);
    return newPermission;
  }, []);

  const showNotification = useCallback(async (
    title: string,
    body: string,
    options?: any
  ): Promise<Notification | null> => {
    return browserNotificationService.show({
      title,
      body,
      ...options,
    });
  }, []);

  const showSuccess = useCallback(async (
    title: string,
    body: string,
    options?: any
  ): Promise<Notification | null> => {
    return browserNotificationService.showSuccess(title, body, options);
  }, []);

  const showError = useCallback(async (
    title: string,
    body: string,
    options?: any
  ): Promise<Notification | null> => {
    return browserNotificationService.showError(title, body, options);
  }, []);

  const showInfo = useCallback(async (
    title: string,
    body: string,
    options?: any
  ): Promise<Notification | null> => {
    return browserNotificationService.showInfo(title, body, options);
  }, []);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showSuccess,
    showError,
    showInfo,
  };
}
