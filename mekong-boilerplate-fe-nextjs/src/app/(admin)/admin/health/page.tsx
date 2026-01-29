'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Zap, HardDrive, Users, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getRedisHealth, RedisHealthResponse } from '@/lib/api/redis-health';

export default function RedisHealthPage() {
  const [health, setHealth] = useState<RedisHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealth = useCallback(async (showToast = false) => {
    try {
      setIsLoading(true);
      const data = await getRedisHealth();
      setHealth(data);
      setLastUpdated(new Date());
      
      if (showToast) {
        toast.success('Health check updated');
      }
    } catch (error) {
      console.error('Failed to fetch Redis health:', error);
      toast.error('Failed to fetch Redis health status');
      setHealth(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchHealth();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchHealth]);

  const handleManualRefresh = () => {
    fetchHealth(true);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.info(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled');
  };

  const getStatusColor = () => {
    if (!health) return 'text-gray-500';
    return health.status === 'connected' ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = () => {
    if (!health) return <AlertCircle className="h-8 w-8 text-gray-500" />;
    return health.status === 'connected' 
      ? <CheckCircle2 className="h-8 w-8 text-green-500" />
      : <XCircle className="h-8 w-8 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Redis Health Check</h1>
          <p className="text-muted-foreground mt-2">
            Monitor Redis connection status and performance metrics
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            size="sm" 
            onClick={toggleAutoRefresh}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleManualRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Connection Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <div>
                <div className={`text-2xl font-bold ${getStatusColor()}`}>
                  {health?.status || 'Unknown'}
                </div>
                {health?.error && (
                  <p className="text-xs text-red-500 mt-1">{health.error}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health?.latency !== null && health?.latency !== undefined 
                ? `${health.latency}ms` 
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Response time
            </p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health?.memory?.used || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Peak: {health?.memory?.peak || 'N/A'}
            </p>
          </CardContent>
        </Card>

        {/* Connected Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health?.connectedClients !== null && health?.connectedClients !== undefined
                ? health.connectedClients
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Memory Info */}
      {health?.memory && (
        <Card>
          <CardHeader>
            <CardTitle>Memory Statistics</CardTitle>
            <CardDescription>
              Detailed Redis memory usage information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Memory Used</p>
                <p className="text-2xl font-bold">{health.memory.used}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peak Memory</p>
                <p className="text-2xl font-bold">{health.memory.peak}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fragmentation Ratio</p>
                <p className="text-2xl font-bold">{health.memory.fragmentation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Details */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
          <CardDescription>
            Raw health check response data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
            {JSON.stringify(health, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
