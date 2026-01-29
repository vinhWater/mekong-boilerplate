# Global Job Monitoring System

This system provides cross-page job monitoring and browser notifications for product uploads and other background tasks.

## Features

- **Global Job Monitoring**: Track jobs across all pages
- **Browser Notifications**: Get notified even when on other pages
- **Smart Polling**: Adaptive polling intervals for efficiency
- **Cross-Page Persistence**: Jobs continue monitoring when navigating
- **Auto Permission Request**: Seamlessly request notification permissions

## Components

### 1. Global Job Monitor (`global-job-monitor.ts`)

The core service that manages job monitoring:

```typescript
import { globalJobMonitor } from '@/lib/services/global-job-monitor';

// Add a job to monitor
globalJobMonitor.addJob({
  id: 'unique-job-id',
  uploadId: 123,
  type: 'product-upload',
  productName: 'My Product',
  shopName: 'My Shop',
  startTime: new Date(),
  userId: 'user-123',
});

// Check active jobs
const activeJobs = globalJobMonitor.getActiveJobs();

// Check if job is active
const isActive = globalJobMonitor.isJobActive('job-id');
```

### 2. Browser Notification Service (`browser-notification.service.ts`)

Handles browser notifications:

```typescript
import { browserNotificationService } from '@/lib/services/browser-notification.service';

// Request permission
await browserNotificationService.requestPermission();

// Show notifications
await browserNotificationService.showSuccess('Title', 'Body');
await browserNotificationService.showError('Title', 'Error message');
await browserNotificationService.showInfo('Title', 'Info message');
```

### 3. React Hooks

#### `useBrowserNotifications`

```typescript
import { useBrowserNotifications } from '@/lib/hooks/use-browser-notifications';

function MyComponent() {
  const { 
    permission, 
    isSupported, 
    requestPermission,
    showSuccess,
    showError 
  } = useBrowserNotifications();

  // Use the hooks...
}
```

#### Enhanced `useUploadToShop`

The hook now automatically:
- Requests notification permission
- Adds jobs to global monitor
- Shows immediate feedback

```typescript
import { useUploadToShop } from '@/lib/hooks/use-staged-products-query';

function UploadComponent() {
  const uploadMutation = useUploadToShop();

  const handleUpload = () => {
    uploadMutation.mutate({
      stagedProductId: 123,
      tiktokShopId: 456
    });
    // Job will be automatically monitored globally
  };
}
```

## UI Components

### 1. Notification Provider

Wrap your app with the notification provider:

```tsx
import { NotificationProvider } from '@/components/providers/notification-provider';

function App() {
  return (
    <NotificationProvider>
      {/* Your app content */}
    </NotificationProvider>
  );
}
```

### 2. Permission Banner

Show a banner to request notification permission:

```tsx
import { NotificationPermissionBanner } from '@/components/ui/notification-permission-banner';

function Dashboard() {
  return (
    <div>
      <NotificationPermissionBanner />
      {/* Rest of your content */}
    </div>
  );
}
```

### 3. Active Jobs Indicator

Show active jobs in your header/navbar:

```tsx
import { ActiveJobsIndicator } from '@/components/ui/active-jobs-indicator';

function Header() {
  return (
    <header>
      {/* Other header content */}
      <ActiveJobsIndicator />
    </header>
  );
}
```

### 4. Notification Status

Show current notification permission status:

```tsx
import { NotificationStatus } from '@/components/ui/notification-permission-banner';

function Settings() {
  return (
    <div>
      <h3>Notifications</h3>
      <NotificationStatus />
    </div>
  );
}
```

## How It Works

1. **Job Creation**: When `useUploadToShop` is called, it creates a product upload and adds the job to the global monitor
2. **Global Monitoring**: The global monitor polls job status every 3 seconds (adaptive)
3. **Cross-Page Persistence**: Jobs continue monitoring even when navigating to other pages
4. **Completion Notifications**: When jobs complete, both toast and browser notifications are shown
5. **Auto Cleanup**: Completed jobs are automatically removed from monitoring

## Configuration

### Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Polling Configuration

You can adjust polling intervals in `global-job-monitor.ts`:

```typescript
private readonly POLL_INTERVAL_MS = 3000; // 3 seconds
private readonly MAX_POLL_INTERVAL_MS = 10000; // 10 seconds
```

## Backend Requirements

The backend must provide these endpoints:

1. `POST /product-uploads` - Create upload (returns `jobId`)
2. `GET /product-uploads/:id/status` - Get job status
3. `GET /product-uploads/:id` - Get full job details

Response format:
```typescript
{
  id: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: number;
  jobId?: string;
  tiktokProductId?: string;
  errorMessage?: string;
  // ... other fields
}
```

## Best Practices

1. **Always request permission early** in the user journey
2. **Show clear feedback** about notification status
3. **Provide fallback UI** for browsers that don't support notifications
4. **Handle permission denial gracefully**
5. **Clean up jobs** when they're no longer needed

## Troubleshooting

### Notifications not working
1. Check if browser supports notifications
2. Verify permission is granted
3. Check if HTTPS is enabled (required for notifications)
4. Verify auth token is available

### Jobs not updating
1. Check network connectivity
2. Verify API endpoints are working
3. Check auth token validity
4. Look for console errors

### Performance issues
1. Monitor number of active jobs
2. Adjust polling intervals if needed
3. Check for memory leaks in job cleanup
