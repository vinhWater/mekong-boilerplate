'use client';

import { useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNotificationContext } from '@/components/providers/notification-provider';

export function NotificationPermissionBanner() {
  const { permission, isSupported, requestPermission } = useNotificationContext();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show banner if notifications aren't supported, permission is granted, or user dismissed it
  if (!isSupported || permission === 'granted' || isDismissed) {
    return null;
  }

  // Don't show if permission was explicitly denied
  if (permission === 'denied') {
    return null;
  }

  const handleRequestPermission = async () => {
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        setIsDismissed(true);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-900">
              Enable Notifications
            </h3>
            <p className="text-sm text-blue-700">
              Get notified when your product uploads complete, even when you're on other pages.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRequestPermission}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Enable
          </Button>
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationStatus() {
  const { permission, isSupported } = useNotificationContext();

  if (!isSupported) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <BellOff className="h-4 w-4" />
        <span>Notifications not supported</span>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (permission) {
      case 'granted':
        return 'text-green-600';
      case 'denied':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusText = () => {
    switch (permission) {
      case 'granted':
        return 'Notifications enabled';
      case 'denied':
        return 'Notifications blocked';
      default:
        return 'Notifications not enabled';
    }
  };

  const getIcon = () => {
    switch (permission) {
      case 'granted':
        return <Bell className="h-4 w-4" />;
      default:
        return <BellOff className="h-4 w-4" />;
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
      {getIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}
