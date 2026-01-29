'use client';

import { apiRequest } from '@/lib/api/api-client';
import { PaginatedResult } from '@/types/pagination';
import { 
  CrawledProduct, 
  CreateCrawledProductDto, 
  CrawledProductQueryDto 
} from '@/types/crawled-product';
import {
  getMockCrawledProducts,
  getMockCrawledProduct,
  createMockCrawledProduct,
  deleteMockCrawledProduct,
  bulkDeleteMockCrawledProducts,
  toggleMockCrawledProductPublic,
  shareMockSelectedProducts
} from '@/lib/api/mock/crawled-products.mock';

// Check if mock data should be used
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Fetch all crawled products with pagination and filtering
 */
export const getCrawledProducts = async (
  params?: CrawledProductQueryDto,
  token?: string
): Promise<PaginatedResult<CrawledProduct>> => {
  if (useMockData) {
    return getMockCrawledProducts(params);
  }
  return apiRequest<PaginatedResult<CrawledProduct>>({
    url: '/crawled-products',
    method: 'GET',
    params,
    token
  });
};

/**
 * Fetch a single crawled product by ID
 */
export const getCrawledProduct = async (
  id: number,
  token?: string
): Promise<CrawledProduct> => {
  if (useMockData) {
    return getMockCrawledProduct(id);
  }
  return apiRequest<CrawledProduct>({
    url: `/crawled-products/${id}`,
    method: 'GET',
    token
  });
};

/**
 * Create a new crawled product
 */
export const createCrawledProduct = async (
  data: CreateCrawledProductDto,
  token?: string
): Promise<CrawledProduct> => {
  if (useMockData) {
    return createMockCrawledProduct(data);
  }
  return apiRequest<CrawledProduct>({
    url: '/crawled-products',
    method: 'POST',
    data,
    token
  });
};

/**
 * Delete a crawled product
 */
export const deleteCrawledProduct = async (
  id: number,
  token?: string
): Promise<void> => {
  if (useMockData) {
    return deleteMockCrawledProduct(id);
  }
  return apiRequest<void>({
    url: `/crawled-products/${id}`,
    method: 'DELETE',
    token
  });
};

/**
 * Bulk delete crawled products
 */
export const bulkDeleteCrawledProducts = async (
  ids: number[],
  token?: string
): Promise<void> => {
  if (useMockData) {
    return bulkDeleteMockCrawledProducts(ids);
  }
  return apiRequest<void>({
    url: '/crawled-products/bulk-delete',
    method: 'POST',
    data: { ids },
    token
  });
};

/**
 * Toggle public status of a crawled product
 */
export const toggleCrawledProductPublic = async (
  id: number,
  isPublic: boolean,
  token?: string
): Promise<CrawledProduct> => {
  if (useMockData) {
    return toggleMockCrawledProductPublic(id, isPublic);
  }
  return apiRequest<CrawledProduct>({
    url: `/crawled-products/${id}/toggle-public`,
    method: 'PATCH',
    data: { isPublic },
    token
  });
};

/**
 * Share selected crawled products (bulk update public status)
 */
export const shareSelectedProducts = async (
  ids: number[],
  isPublic: boolean,
  token?: string
): Promise<{ message: string; updatedCount: number; products: CrawledProduct[] }> => {
  if (useMockData) {
    return shareMockSelectedProducts(ids, isPublic);
  }
  return apiRequest<{ message: string; updatedCount: number; products: CrawledProduct[] }>({
    url: '/crawled-products/share-selected',
    method: 'POST',
    data: { ids, isPublic },
    token
  });
};
