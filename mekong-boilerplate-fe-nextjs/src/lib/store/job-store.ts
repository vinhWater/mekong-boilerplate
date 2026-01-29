import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JobInfo {
  id: string;
  uploadId?: number; // Optional for order sync and product sync jobs
  type: 'product-upload' | 'order-sync' | 'product-sync' | 'fulfillment-request' | 'design-import';
  productName?: string;
  shopName?: string;
  startTime: Date;
  userId?: string;
  // Order sync and product sync specific fields
  syncType?: 'single-shop' | 'multi-shop';
  shopCount?: number; // For multi-shop sync jobs
  // Fulfillment request specific fields
  orderIdTT?: string;
  provider?: string;
  // Design import specific fields
  totalRows?: number;
  successCount?: number;
  skipCount?: number;
  errorCount?: number;
}

export interface CompletedJobInfo extends JobInfo {
  completedAt: Date;
  duration: number; // milliseconds
  status: 'COMPLETED' | 'FAILED';
  errorMessage?: string;
  tiktokProductId?: string;
  persistedAt: number; // timestamp for cleanup
}

export interface RefetchTriggers {
  products: number; // timestamp - for product sync
  'product-detail': number; // timestamp - for product sync
  'product-uploads': number; // timestamp - for product upload
  'product-upload-detail': number; // timestamp - for product upload
  orders: number; // timestamp
  'order-detail': number; // timestamp
  'fulfillment-history': number; // timestamp - for fulfillment request
  'design-files': number; // timestamp - for design import
}

interface JobStore {
  // Active jobs
  activeJobs: JobInfo[];

  // Completed jobs (max 10)
  completedJobs: CompletedJobInfo[];

  // Refetch triggers for other components
  refetchTriggers: RefetchTriggers;

  // Actions for active jobs
  addJob: (job: JobInfo) => void;
  removeActiveJob: (jobId: string) => void;
  getActiveJobs: () => JobInfo[];
  isJobActive: (jobId: string) => boolean;

  // Actions for completed jobs
  completeJob: (jobId: string, result: {
    status: 'COMPLETED' | 'FAILED';
    errorMessage?: string;
    tiktokProductId?: string;
  }) => void;
  getCompletedJobs: () => CompletedJobInfo[];

  // Actions for refetch triggers
  triggerRefetch: (page: keyof RefetchTriggers) => void;
  getRefetchTrigger: (page: keyof RefetchTriggers) => number;

  // Utility actions
  clearJobsOnSignout: () => void;
  getJobById: (jobId: string) => JobInfo | CompletedJobInfo | null;
  cleanupExpiredJobs: () => void;
}

const MAX_COMPLETED_JOBS = 10;
const COMPLETED_JOBS_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeJobs: [],
      completedJobs: [],
      refetchTriggers: {
        products: 0,
        'product-detail': 0,
        'product-uploads': 0,
        'product-upload-detail': 0,
        orders: 0,
        'order-detail': 0,
        'fulfillment-history': 0,
        'design-files': 0,
      },

      // Active jobs actions
      addJob: (job: JobInfo) => {
        set((state) => ({
          activeJobs: [...state.activeJobs, job],
        }));
        console.log(`[JobStore] Added job to monitor:`, job);
      },

      removeActiveJob: (jobId: string) => {
        const state = get();
        const jobToRemove = state.activeJobs.find(job => job.id === jobId);

        if (jobToRemove && jobToRemove.type === 'design-import') {
          get().triggerRefetch('design-files');
        }

        set((state) => ({
          activeJobs: state.activeJobs.filter(job => job.id !== jobId),
        }));
        console.log(`[JobStore] Removed active job: ${jobId}`);
      },

      getActiveJobs: () => {
        return get().activeJobs;
      },

      isJobActive: (jobId: string) => {
        return get().activeJobs.some(job => job.id === jobId);
      },

      // Completed jobs actions
      completeJob: (jobId: string, result: {
        status: 'COMPLETED' | 'FAILED';
        errorMessage?: string;
        tiktokProductId?: string;
      }) => {
        const state = get();
        const activeJob = state.activeJobs.find(job => job.id === jobId);

        if (!activeJob) {
          console.warn(`[JobStore] Job ${jobId} not found in active jobs`);
          return;
        }

        const completedJob: CompletedJobInfo = {
          ...activeJob,
          completedAt: new Date(),
          duration: Date.now() - activeJob.startTime.getTime(),
          status: result.status,
          errorMessage: result.errorMessage,
          tiktokProductId: result.tiktokProductId,
          persistedAt: Date.now(),
        };

        set((state) => {
          // Remove from active jobs
          const newActiveJobs = state.activeJobs.filter(job => job.id !== jobId);

          // Clean up expired jobs first
          const now = Date.now();
          const validCompletedJobs = state.completedJobs.filter(
            job => (now - job.persistedAt) < COMPLETED_JOBS_TTL
          );

          // Add to completed jobs (keep only last 10 after cleanup)
          const newCompletedJobs = [completedJob, ...validCompletedJobs].slice(0, MAX_COMPLETED_JOBS);

          return {
            activeJobs: newActiveJobs,
            completedJobs: newCompletedJobs,
          };
        });

        // Trigger refetch for relevant pages based on job type
        if (activeJob.type === 'product-upload') {
          get().triggerRefetch('product-uploads');
          if (result.tiktokProductId) {
            get().triggerRefetch('product-upload-detail');
          }
        } else if (activeJob.type === 'order-sync') {
          get().triggerRefetch('orders');
          get().triggerRefetch('order-detail');
        } else if (activeJob.type === 'product-sync') {
          get().triggerRefetch('products');
          get().triggerRefetch('product-detail');
        } else if (activeJob.type === 'fulfillment-request') {
          get().triggerRefetch('fulfillment-history');
        }

        console.log(`[JobStore] Job completed:`, completedJob);
      },

      getCompletedJobs: () => {
        // Auto cleanup expired jobs when accessing completed jobs
        const state = get();
        const now = Date.now();
        const validJobs = state.completedJobs.filter(
          job => (now - job.persistedAt) < COMPLETED_JOBS_TTL
        );

        // Update store if we found expired jobs
        if (validJobs.length !== state.completedJobs.length) {
          set({ completedJobs: validJobs });
          console.log(`[JobStore] Auto-cleaned ${state.completedJobs.length - validJobs.length} expired jobs`);
        }

        return validJobs;
      },

      // Refetch triggers actions
      triggerRefetch: (page: keyof RefetchTriggers) => {
        set((state) => ({
          refetchTriggers: {
            ...state.refetchTriggers,
            [page]: Date.now(),
          },
        }));
        console.log(`[JobStore] Triggered refetch for: ${page}`);
      },

      getRefetchTrigger: (page: keyof RefetchTriggers) => {
        return get().refetchTriggers[page];
      },

      // Clear jobs on user signout - called from auth hooks
      clearJobsOnSignout: () => {
        set({
          activeJobs: [],
          completedJobs: [],
          refetchTriggers: {
            products: 0,
            'product-detail': 0,
            'product-uploads': 0,
            'product-upload-detail': 0,
            orders: 0,
            'order-detail': 0,
            'fulfillment-history': 0,
            'design-files': 0,
          },
        });
        console.log(`[JobStore] Cleared all jobs on user signout`);
      },

      getJobById: (jobId: string) => {
        const state = get();
        return state.activeJobs.find(job => job.id === jobId) ||
          state.completedJobs.find(job => job.id === jobId) ||
          null;
      },

      cleanupExpiredJobs: () => {
        const now = Date.now();
        set((state) => ({
          completedJobs: state.completedJobs.filter(
            job => (now - job.persistedAt) < COMPLETED_JOBS_TTL
          ),
        }));
        console.log(`[JobStore] Cleaned up expired jobs`);
      },
    }),
    {
      name: 'job-store',
      partialize: (state) => ({
        // Only persist completed jobs, not active jobs
        completedJobs: state.completedJobs,
        // Don't persist activeJobs - they should be fresh on each session
        // Don't persist refetchTriggers - they are session-specific
      }),
      // Automatically cleanup expired jobs when loading from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.cleanupExpiredJobs();
        }
      },
    }
  )
);
