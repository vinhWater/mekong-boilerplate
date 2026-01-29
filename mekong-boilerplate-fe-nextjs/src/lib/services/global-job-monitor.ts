'use client';

import { toast } from 'sonner';
import { getSession } from 'next-auth/react';
import { useJobStore, type JobInfo } from '@/lib/store/job-store';

// Re-export JobInfo for backward compatibility
export type { JobInfo };

export interface JobStatus {
  id: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: number;
  tiktokProductId?: string;
  errorMessage?: string;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface JobCompletionData {
  uploadId: number;
  jobId: string;
  status: 'COMPLETED' | 'FAILED';
  productName?: string;
  shopName?: string;
  tiktokProductId?: string;
  errorMessage?: string;
}

class GlobalJobMonitor {
  private pollInterval: NodeJS.Timeout | null = null;
  private readonly POLL_INTERVAL_MS = 3000; // 3 seconds
  private readonly MAX_POLL_INTERVAL_MS = 10000; // 10 seconds
  private currentInterval = this.POLL_INTERVAL_MS;
  private isPolling = false;
  private jobStore = useJobStore.getState();

  constructor() {
    // Subscribe to store changes
    useJobStore.subscribe((state) => {
      this.jobStore = state;
    });
  }

  /**
   * Add a job to be monitored
   */
  addJob(jobInfo: JobInfo) {
    console.log(`[GlobalJobMonitor] Adding job to monitor:`, jobInfo);
    this.jobStore.addJob(jobInfo);
    this.startPolling();

    // Show initial notification based on job type
    if (jobInfo.type === 'product-upload') {
      toast.info(`Product upload started: ${jobInfo.productName || 'Unknown Product'}`, {
        description: `Uploading to ${jobInfo.shopName || 'TikTok Shop'}...`,
        duration: 3000,
      });
    } else if (jobInfo.type === 'order-sync') {
      const syncDescription = jobInfo.syncType === 'multi-shop'
        ? `Synchronizing orders from ${jobInfo.shopCount || 'multiple'} shops...`
        : `Synchronizing orders from ${jobInfo.shopName || 'TikTok Shop'}...`;

      toast.info(`Order synchronization started`, {
        description: syncDescription,
        duration: 3000,
      });
    } else if (jobInfo.type === 'product-sync') {
      const syncDescription = jobInfo.syncType === 'multi-shop'
        ? `Synchronizing products from ${jobInfo.shopCount || 'multiple'} shops...`
        : `Synchronizing products from ${jobInfo.shopName || 'TikTok Shop'}...`;

      toast.info(`Product synchronization started`, {
        description: syncDescription,
        duration: 3000,
      });
    } else if (jobInfo.type === 'fulfillment-request') {
      toast.info(`Fulfillment request started`, {
        description: `Sending order ${jobInfo.orderIdTT || 'N/A'} to ${jobInfo.provider || 'provider'}...`,
        duration: 3000,
      });
    } else if (jobInfo.type === 'design-import') {
      toast.info(`Design import started`, {
        description: `Importing ${jobInfo.totalRows || 0} designs from CSV...`,
        duration: 3000,
      });
    }
  }

  /**
   * Remove a job from monitoring
   */
  removeJob(jobId: string) {
    console.log(`[GlobalJobMonitor] Removing job from monitor: ${jobId}`);
    this.jobStore.removeActiveJob(jobId);

    if (this.jobStore.getActiveJobs().length === 0) {
      this.stopPolling();
    }
  }

  /**
   * Get all active jobs
   */
  getActiveJobs(): JobInfo[] {
    return this.jobStore.getActiveJobs();
  }

  /**
   * Check if a job is being monitored
   */
  isJobActive(jobId: string): boolean {
    return this.jobStore.isJobActive(jobId);
  }

  /**
   * Start polling for job status updates
   */
  private startPolling() {
    const activeJobs = this.jobStore.getActiveJobs();
    if (this.isPolling || activeJobs.length === 0) {
      return;
    }

    console.log(`[GlobalJobMonitor] Starting polling with ${activeJobs.length} active jobs`);
    this.isPolling = true;
    this.currentInterval = this.POLL_INTERVAL_MS;
    this.poll();
  }

  /**
   * Stop polling
   */
  private stopPolling() {
    if (this.pollInterval) {
      clearTimeout(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
    console.log(`[GlobalJobMonitor] Stopped polling`);
  }

  /**
   * Poll for job status updates
   */
  private async poll() {
    const activeJobs = this.jobStore.getActiveJobs();
    if (!this.isPolling || activeJobs.length === 0) {
      this.stopPolling();
      return;
    }

    try {
      const jobPromises = activeJobs.map(
        async (jobInfo) => {
          try {
            const status = await this.checkJobStatus(jobInfo);
            return { jobId: jobInfo.id, jobInfo, status, error: null };
          } catch (error) {
            console.error(`[GlobalJobMonitor] Error checking job ${jobInfo.id}:`, error);
            return { jobId: jobInfo.id, jobInfo, status: null, error };
          }
        }
      );

      const results = await Promise.allSettled(jobPromises);
      let hasCompletedJobs = false;

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.status) {
          const { jobId, jobInfo, status } = result.value;

          if (status.status === 'COMPLETED' || status.status === 'FAILED') {
            hasCompletedJobs = true;

            // Move job to completed in store
            this.jobStore.completeJob(jobId, {
              status: status.status,
              errorMessage: status.errorMessage,
              tiktokProductId: status.tiktokProductId,
            });

            // Show notifications
            this.handleJobCompletion({
              uploadId: status.id,
              jobId: status.jobId || jobId,
              status: status.status,
              productName: jobInfo.productName,
              shopName: jobInfo.shopName,
              tiktokProductId: status.tiktokProductId,
              errorMessage: status.errorMessage,
            });
          }
        }
      }

      // Adjust polling interval based on activity
      if (hasCompletedJobs) {
        this.currentInterval = this.POLL_INTERVAL_MS; // Reset to fast polling
      } else {
        // Gradually increase interval for long-running jobs
        this.currentInterval = Math.min(
          this.currentInterval * 1.2,
          this.MAX_POLL_INTERVAL_MS
        );
      }

    } catch (error) {
      console.error(`[GlobalJobMonitor] Polling error:`, error);
    }

    // Schedule next poll
    const currentActiveJobs = this.jobStore.getActiveJobs();
    if (this.isPolling && currentActiveJobs.length > 0) {
      this.pollInterval = setTimeout(() => this.poll(), this.currentInterval);
    } else {
      this.stopPolling();
    }
  }

  /**
   * Check job status via API
   */
  private async checkJobStatus(jobInfo: JobInfo): Promise<JobStatus> {
    try {
      const session = await getSession();

      if (!session?.backendToken) {
        throw new Error('No authentication token available');
      }

      let endpoint: string;
      if (jobInfo.type === 'product-upload' && jobInfo.uploadId) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/product-uploads/${jobInfo.uploadId}/status`;
      } else if (jobInfo.type === 'order-sync') {
        // For order sync jobs, we'll check the job status by job ID
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/orders/sync-job-status/${jobInfo.id}`;
      } else if (jobInfo.type === 'product-sync') {
        // For product sync jobs, we'll use a similar pattern to order sync
        // TODO: Backend needs to implement this endpoint
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/products/sync-job-status/${jobInfo.id}`;
      } else if (jobInfo.type === 'fulfillment-request') {
        // For fulfillment request jobs
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/orders/fulfillment-job-status/${jobInfo.id}`;
      } else if (jobInfo.type === 'design-import') {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/designs/import-job-status/${jobInfo.id}`;
      } else {
        throw new Error(`Unsupported job type: ${jobInfo.type} or missing uploadId`);
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${session.backendToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error checking job status:', error);
      throw error;
    }
  }

  /**
   * Handle job completion
   */
  private handleJobCompletion(data: JobCompletionData) {
    console.log(`[GlobalJobMonitor] Job completed:`, data);

    if (data.status === 'COMPLETED') {
      this.showSuccessNotification(data);
    } else {
      this.showErrorNotification(data);
    }
  }

  /**
   * Show success notification
   */
  private showSuccessNotification(data: JobCompletionData) {
    // Get job info to determine notification type
    const jobInfo = this.jobStore.getJobById(data.jobId);

    if (jobInfo?.type === 'order-sync') {
      // Order sync success notification
      const syncDescription = jobInfo.syncType === 'multi-shop'
        ? `Orders synchronized from ${jobInfo.shopCount || 'multiple'} shops`
        : `Orders synchronized from ${data.shopName || 'TikTok Shop'}`;

      toast.success(`Order synchronization completed!`, {
        description: syncDescription,
        duration: 5000,
        action: {
          label: 'View Orders',
          onClick: () => {
            // Navigate to orders page
            window.location.href = '/client/tiktok/order';
          },
        },
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Order Synchronization Completed',
        body: syncDescription,
        icon: '/favicon.ico',
        tag: `order-sync-success-${data.jobId}`,
        data: data,
      });
    } else if (jobInfo?.type === 'product-sync') {
      // Product sync success notification
      const syncDescription = jobInfo.syncType === 'multi-shop'
        ? `Products synchronized from ${jobInfo.shopCount || 'multiple'} shops`
        : `Products synchronized from ${data.shopName || 'TikTok Shop'}`;

      toast.success(`Product synchronization completed!`, {
        description: syncDescription,
        duration: 5000,
        action: {
          label: 'View Products',
          onClick: () => {
            // Navigate to products page
            window.location.href = '/client/tiktok/product';
          },
        },
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Product Synchronization Completed',
        body: syncDescription,
        icon: '/favicon.ico',
        tag: `product-sync-success-${data.jobId}`,
        data: data,
      });
    } else if (jobInfo?.type === 'fulfillment-request') {
      // Fulfillment request success notification
      toast.success(`Fulfillment request completed!`, {
        description: `Order ${jobInfo.orderIdTT || 'N/A'} sent to ${jobInfo.provider || 'provider'} successfully`,
        duration: 5000,
        action: {
          label: 'View Order',
          onClick: () => {
            // Navigate to order detail page
            window.location.href = `/client/tiktok/order`;
          },
        },
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Fulfillment Request Completed',
        body: `Order ${jobInfo.orderIdTT || 'N/A'} sent to ${jobInfo.provider || 'provider'} successfully`,
        icon: '/favicon.ico',
        tag: `fulfillment-success-${data.jobId}`,
        data: data,
      });
    } else if (jobInfo?.type === 'design-import') {
      toast.success(`Design import completed!`, {
        description: `Imported ${jobInfo.successCount || 0} of ${jobInfo.totalRows || 0} designs`,
        duration: 5000,
        action: {
          label: 'View Designs',
          onClick: () => {
            window.location.href = '/client/design';
          },
        },
      });

      this.showBrowserNotification({
        title: 'Design Import Completed',
        body: `Successfully imported ${jobInfo.successCount || 0} designs`,
        icon: '/favicon.ico',
        tag: `design-import-success-${data.jobId}`,
        data: data,
      });
    } else {
      // Product upload success notification (existing logic)
      toast.success(`Product uploaded successfully!`, {
        description: `${data.productName || 'Product'} uploaded to ${data.shopName || 'TikTok Shop'}`,
        duration: 5000,
        action: data.tiktokProductId ? {
          label: 'View Product',
          onClick: () => {
            // Navigate to product details or TikTok shop
            console.log(`Navigate to product: ${data.tiktokProductId}`);
          },
        } : undefined,
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Product Upload Completed',
        body: `${data.productName || 'Product'} has been uploaded successfully to ${data.shopName || 'TikTok Shop'}`,
        icon: '/favicon.ico',
        tag: `upload-success-${data.uploadId}`,
        data: data,
      });
    }
  }

  /**
   * Show error notification
   */
  private showErrorNotification(data: JobCompletionData) {
    // Get job info to determine notification type
    const jobInfo = this.jobStore.getJobById(data.jobId);

    if (jobInfo?.type === 'order-sync') {
      // Order sync error notification
      const syncDescription = jobInfo.syncType === 'multi-shop'
        ? `Failed to synchronize orders from ${jobInfo.shopCount || 'multiple'} shops`
        : `Failed to synchronize orders from ${data.shopName || 'TikTok Shop'}`;

      toast.error(`Order synchronization failed`, {
        description: data.errorMessage || 'Unknown error occurred',
        duration: 8000,
        action: {
          label: 'View Orders',
          onClick: () => {
            // Navigate to orders page
            window.location.href = '/client/tiktok/order';
          },
        },
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Order Synchronization Failed',
        body: `${syncDescription}: ${data.errorMessage || 'Unknown error'}`,
        icon: '/favicon.ico',
        tag: `order-sync-error-${data.jobId}`,
        data: data,
      });
    } else if (jobInfo?.type === 'product-sync') {
      // Product sync error notification
      const syncDescription = jobInfo.syncType === 'multi-shop'
        ? `Failed to synchronize products from ${jobInfo.shopCount || 'multiple'} shops`
        : `Failed to synchronize products from ${data.shopName || 'TikTok Shop'}`;

      toast.error(`Product synchronization failed`, {
        description: data.errorMessage || 'Unknown error occurred',
        duration: 8000,
        action: {
          label: 'View Products',
          onClick: () => {
            // Navigate to products page
            window.location.href = '/client/tiktok/product';
          },
        },
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Product Synchronization Failed',
        body: `${syncDescription}: ${data.errorMessage || 'Unknown error'}`,
        icon: '/favicon.ico',
        tag: `product-sync-error-${data.jobId}`,
        data: data,
      });
    } else if (jobInfo?.type === 'fulfillment-request') {
      // Fulfillment request error notification
      toast.error(`Fulfillment request failed`, {
        description: data.errorMessage || 'Unknown error occurred',
        duration: 8000,
        action: {
          label: 'View Order',
          onClick: () => {
            // Navigate to order detail page
            window.location.href = `/client/tiktok/order`;
          },
        },
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Fulfillment Request Failed',
        body: `Failed to send order ${jobInfo.orderIdTT || 'N/A'} to ${jobInfo.provider || 'provider'}: ${data.errorMessage || 'Unknown error'}`,
        icon: '/favicon.ico',
        tag: `fulfillment-error-${data.jobId}`,
        data: data,
      });
    } else if (jobInfo?.type === 'design-import') {
      toast.error(`Design import failed`, {
        description: data.errorMessage || 'Unknown error occurred',
        duration: 8000,
      });

      this.showBrowserNotification({
        title: 'Design Import Failed',
        body: `Failed to import designs: ${data.errorMessage || 'Unknown error'}`,
        icon: '/favicon.ico',
        tag: `design-import-error-${data.jobId}`,
        data: data,
      });
    } else {
      // Product upload error notification (existing logic)
      toast.error(`Product upload failed`, {
        description: data.errorMessage || 'Unknown error occurred',
        duration: 8000,
        action: {
          label: 'Retry',
          onClick: () => {
            // Navigate to retry page
            console.log(`Retry upload for: ${data.uploadId}`);
          },
        },
      });

      // Browser notification
      this.showBrowserNotification({
        title: 'Product Upload Failed',
        body: `Failed to upload ${data.productName || 'product'}: ${data.errorMessage || 'Unknown error'}`,
        icon: '/favicon.ico',
        tag: `upload-error-${data.uploadId}`,
        data: data,
      });
    }
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    data?: any;
  }) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        data: options.data,
      });

      notification.onclick = () => {
        window.focus();
        // Navigate to relevant page based on notification data
        if (options.data?.uploadId) {
          // You can implement navigation logic here
          console.log(`Navigate to upload details: ${options.data.uploadId}`);
        }
        notification.close();
      };
    }
  }



  /**
   * Clean up resources
   */
  destroy() {
    this.stopPolling();
  }
}

// Create singleton instance
export const globalJobMonitor = new GlobalJobMonitor();

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalJobMonitor.destroy();
  });
}
