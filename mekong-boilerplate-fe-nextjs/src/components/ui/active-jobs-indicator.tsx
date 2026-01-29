'use client';

import { useState } from 'react';
import { Upload, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobStore, type JobInfo, type CompletedJobInfo } from '@/lib/store/job-store';

export function ActiveJobsIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Subscribe to job store
  const activeJobs = useJobStore((state) => state.activeJobs);
  const completedJobs = useJobStore((state) => state.completedJobs);

  const formatTimeElapsed = (startTime: Date) => {
    const elapsed = Date.now() - startTime.getTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const hasActiveJobs = activeJobs.length > 0;
  const totalJobs = activeJobs.length + completedJobs.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative text-white bg-black/40 border-white/20 hover:bg-black/60 h-8 sm:h-10"
        >
          {hasActiveJobs && activeJobs.some(job => job.type === 'order-sync' || job.type === 'product-sync') ? (
            <RefreshCw className="h-4 w-4 mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          <span className="hidden sm:inline">Jobs</span>
          {hasActiveJobs ? (
            <Badge
              variant="secondary"
              className="ml-2 bg-primary text-white animate-pulse"
            >
              {activeJobs.length}
            </Badge>
          ) : totalJobs > 0 ? (
            <Badge
              variant="secondary"
              className="ml-2 bg-primary text-white"
            >
              {completedJobs.length}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="ml-2 bg-primary/60 text-white"
            >
              0
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              {hasActiveJobs && activeJobs.some(job => job.type === 'order-sync' || job.type === 'product-sync') ? (
                <RefreshCw className="h-4 w-4 mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Job Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active" className="text-xs">
                  Active ({activeJobs.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">
                  Completed ({completedJobs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4 space-y-3">
                {hasActiveJobs ? (
                  <>
                    {activeJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job.type === 'order-sync'
                              ? (job.syncType === 'multi-shop'
                                ? `Order Sync (${job.shopCount || 0} shops)`
                                : 'Order Sync')
                              : job.type === 'product-sync'
                                ? (job.syncType === 'multi-shop'
                                  ? `Product Sync (${job.shopCount || 0} shops)`
                                  : 'Product Sync')
                                : job.type === 'fulfillment-request'
                                  ? `Fulfillment Request`
                                  : job.type === 'design-import'
                                    ? `Design Import`
                                    : (job.productName || 'Unknown Product')
                            }
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {job.type === 'fulfillment-request'
                              ? `Order ${job.orderIdTT || 'N/A'} → ${job.provider || 'Provider'}`
                              : (job.shopName || 'TikTok Shop')
                            }
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimeElapsed(job.startTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 text-center">
                        You'll be notified when jobs complete
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Clock className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      No active jobs
                    </p>
                    <p className="text-xs text-gray-500">
                      All jobs are complete
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-4 space-y-3">
                {completedJobs.length > 0 ? (
                  <>
                    {completedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border"
                      >
                        <div className="flex-shrink-0">
                          {job.status === 'COMPLETED' ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job.type === 'order-sync'
                              ? (job.syncType === 'multi-shop'
                                ? `Order Sync (${job.shopCount || 0} shops)`
                                : 'Order Sync')
                              : job.type === 'product-sync'
                                ? (job.syncType === 'multi-shop'
                                  ? `Product Sync (${job.shopCount || 0} shops)`
                                  : 'Product Sync')
                                : job.type === 'fulfillment-request'
                                  ? `Fulfillment Request`
                                  : job.type === 'design-import'
                                    ? `Design Import`
                                    : (job.productName || 'Unknown Product')
                            }
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {job.type === 'fulfillment-request'
                              ? `Order ${job.orderIdTT || 'N/A'} → ${job.provider || 'Provider'}`
                              : (job.shopName || 'TikTok Shop')
                            }
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatDuration(job.duration)}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(job.completedAt).toISOString()}
                            </span>
                            {job.status === 'FAILED' && job.errorMessage && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-red-500 truncate">
                                  {job.errorMessage}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircle className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      No completed jobs
                    </p>
                    <p className="text-xs text-gray-500">
                      Completed jobs will appear here
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export function JobStatusBadge({ status, jobType }: { status: string; jobType?: 'product-upload' | 'order-sync' | 'product-sync' }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          label: 'Completed'
        };
      case 'FAILED':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800',
          label: 'Failed'
        };
      case 'IN_PROGRESS':
        return {
          icon: (jobType === 'order-sync' || jobType === 'product-sync') ? RefreshCw : Upload,
          color: 'bg-blue-100 text-blue-800',
          label: jobType === 'order-sync' ? 'Syncing Orders' : jobType === 'product-sync' ? 'Syncing Products' : 'Uploading'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800',
          label: 'Pending'
        };
    }
  };

  const { icon: Icon, color, label } = getStatusConfig();

  return (
    <Badge className={`${color} flex items-center space-x-1`}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </Badge>
  );
}
