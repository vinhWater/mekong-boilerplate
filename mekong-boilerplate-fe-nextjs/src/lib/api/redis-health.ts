import { apiClient } from './api-client';

export interface RedisHealthResponse {
  status: 'connected' | 'disconnected';
  latency: number | null;
  memory: {
    used: string;
    peak: string;
    fragmentation: string;
  } | null;
  connectedClients: number | null;
  timestamp: string;
  error?: string;
}

export async function getRedisHealth(): Promise<RedisHealthResponse> {
  const response = await apiClient.get<RedisHealthResponse>('/health/redis');
  return response.data;
}
