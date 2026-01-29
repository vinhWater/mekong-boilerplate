'use client';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
  duration?: number;
  onClick?: () => void;
}

class BrowserNotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Show a browser notification
   */
  async show(options: NotificationOptions): Promise<Notification | null> {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('Browser notifications not supported');
      return null;
    }

    // Request permission if not granted
    if (this.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        data: options.data,
        requireInteraction: false, // Don't require user interaction to dismiss
      });

      // Handle click event
      if (options.onClick) {
        notification.onclick = () => {
          window.focus();
          options.onClick?.();
          notification.close();
        };
      }

      // Auto close after specified duration
      if (options.duration && options.duration > 0) {
        setTimeout(() => {
          notification.close();
        }, options.duration);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show success notification
   */
  async showSuccess(title: string, body: string, options?: Partial<NotificationOptions>): Promise<Notification | null> {
    return this.show({
      title,
      body,
      icon: '/icons/success.png',
      duration: 5000,
      ...options,
    });
  }

  /**
   * Show error notification
   */
  async showError(title: string, body: string, options?: Partial<NotificationOptions>): Promise<Notification | null> {
    return this.show({
      title,
      body,
      icon: '/icons/error.png',
      duration: 8000,
      ...options,
    });
  }

  /**
   * Show info notification
   */
  async showInfo(title: string, body: string, options?: Partial<NotificationOptions>): Promise<Notification | null> {
    return this.show({
      title,
      body,
      icon: '/icons/info.png',
      duration: 4000,
      ...options,
    });
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Check if permission is granted
   */
  isPermissionGranted(): boolean {
    return this.permission === 'granted';
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }

  /**
   * Close all notifications with a specific tag
   */
  closeByTag(tag: string): void {
    // Note: There's no direct way to close notifications by tag
    // This is a limitation of the Notification API
    console.log(`Request to close notifications with tag: ${tag}`);
  }
}

// Create singleton instance
export const browserNotificationService = new BrowserNotificationService();

// Auto-request permission on first interaction (optional)
export const initializeBrowserNotifications = async (): Promise<NotificationPermission> => {
  return browserNotificationService.requestPermission();
};
