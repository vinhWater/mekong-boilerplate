'use client';

import { apiRequest } from '@/lib/api/api-client';

/**
 * Interface for the attribute in the response
 */
export interface AttributeDto {
  name: string;
  valueNames: string[];
}

/**
 * Interface for the sales attribute in a SKU
 */
export interface SalesAttributeDto {
  name: string;
  valueName: string;
}

/**
 * Interface for a single SKU in the response
 */
export interface SkuDto {
  salesAttributes: SalesAttributeDto[];
}

/**
 * Interface for the generate SKUs response
 */
export interface GenerateSkusResponseDto {
  skus: SkuDto[];
  attributes: AttributeDto[];
}

/**
 * Generate SKUs from Gearment stock data
 * @param gearmentStockType The type of Gearment stock to use (e.g., 'YOUTH', 'ADULT')
 * @param token Optional auth token
 * @returns Promise with the generated SKUs and attributes
 */
export const generateSkusFromGearment = async (
  gearmentStockType: string,
  token?: string
): Promise<GenerateSkusResponseDto> => {
  return apiRequest<GenerateSkusResponseDto>({
    url: '/providers/gearment/generate-skus',
    method: 'POST',
    data: { gearmentStockType },
    token
  });
};

/**
 * Get Gearment stock status with pagination
 * @param params Query parameters for filtering and pagination
 * @param token Optional auth token
 * @returns Promise with the paginated stock status
 */
export const getGearmentStockStatus = async (
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    name?: string;
    color?: string;
    size?: string;
    type?: string;
  },
  token?: string
): Promise<any> => {
  return apiRequest<any>({
    url: '/providers/gearment/stock-status',
    method: 'GET',
    params,
    token
  });
};

/**
 * Sync Gearment stock status from API to database
 * @param token Optional auth token
 * @returns Promise with the sync result
 */
export const syncGearmentStockStatus = async (
  token?: string
): Promise<{ success: boolean; message: string; syncedCount: number }> => {
  return apiRequest<{ success: boolean; message: string; syncedCount: number }>({
    url: '/providers/gearment/sync-stock-status',
    method: 'POST',
    token
  });
};
