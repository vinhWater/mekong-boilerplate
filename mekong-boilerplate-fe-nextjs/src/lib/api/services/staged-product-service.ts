'use client';

import { apiRequest } from '@/lib/api/api-client';
import {
  StagedProduct,
  StagedProductCreateInput,
  StagedProductUpdateInput,
  StagedProductFilters,
  StagedProductListResponse,
  ProductUploadCreateInput,
  ProductUploadFilters,
  ProductUploadListResponse,
  ProductUpload,
  ProductUploadResponse,
  ProductUploadStatusResponse
} from '@/types/staged-product';

/**
 * Get a list of staged products with optional filters
 */
export const getStagedProducts = async (
  filters?: StagedProductFilters,
  token?: string
): Promise<StagedProductListResponse> => {
  return apiRequest<StagedProductListResponse>({
    url: '/staged-products/all-staged-products',
    method: 'GET',
    params: filters,
    token
  });
};

/**
 * Get a single staged product by ID
 */
export const getStagedProduct = async (
  id: number,
  token?: string
): Promise<StagedProduct> => {
  return apiRequest<StagedProduct>({
    url: `/staged-products/${id}`,
    method: 'GET',
    token
  });
};

/**
 * Create a new staged product
 */
export const createStagedProduct = async (
  data: StagedProductCreateInput,
  token?: string
): Promise<StagedProduct> => {
  return apiRequest<StagedProduct>({
    url: '/staged-products',
    method: 'POST',
    data,
    token
  });
};

/**
 * Create a staged product from a template
 */
export const createStagedProductFromTemplate = async (
  data: {
    templateId: number;
    title: string;
    images?: Array<{
      imageUrl?: string;
      r2Key?: string;
    }>;
    crawledProductId?: number;
  },
  token?: string
): Promise<StagedProduct> => {
  return apiRequest<StagedProduct>({
    url: '/staged-products/from-template',
    method: 'POST',
    data,
    token
  });
};

/**
 * Update an existing staged product
 */
export const updateStagedProduct = async (
  id: number,
  data: StagedProductUpdateInput,
  token?: string
): Promise<StagedProduct> => {
  return apiRequest<StagedProduct>({
    url: `/staged-products/${id}`,
    method: 'PATCH',
    data,
    token
  });
};

/**
 * Delete a staged product
 */
export const deleteStagedProduct = async (
  id: number,
  token?: string
): Promise<void> => {
  return apiRequest<void>({
    url: `/staged-products/${id}`,
    method: 'DELETE',
    token
  });
};

/**
 * Get upload history for a staged product
 */
export const getStagedProductUploads = async (
  stagedProductId: number,
  filters?: ProductUploadFilters,
  token?: string
): Promise<ProductUpload[]> => {
  return apiRequest<ProductUpload[]>({
    url: `/staged-products/${stagedProductId}/uploads`,
    method: 'GET',
    params: filters,
    token
  });
};

/**
 * Create a new product upload (upload to TikTok shop)
 */
export const createProductUpload = async (
  data: ProductUploadCreateInput,
  token?: string
): Promise<ProductUploadResponse> => {
  return apiRequest<ProductUploadResponse>({
    url: '/product-uploads',
    method: 'POST',
    data,
    token
  });
};

/**
 * Get product upload status by ID
 */
export const getProductUploadStatus = async (
  uploadId: number,
  token?: string
): Promise<ProductUploadStatusResponse> => {
  return apiRequest<ProductUploadStatusResponse>({
    url: `/product-uploads/${uploadId}/status`,
    method: 'GET',
    token
  });
};

/**
 * Get product upload details by ID
 */
export const getProductUploadById = async (
  uploadId: number,
  token?: string
): Promise<ProductUploadResponse> => {
  return apiRequest<ProductUploadResponse>({
    url: `/product-uploads/${uploadId}`,
    method: 'GET',
    token
  });
};

/**
 * Create a staged product from template and immediately upload to TikTok Shop
 */
export const createStagedProductFromTemplateAndUpload = async (
  data: {
    templateId: number;
    title: string;
    images?: Array<{
      imageUrl?: string;
      r2Key?: string;
    }>;
    tiktokShopId: number;
    skipValidation?: boolean;
    forceUpload?: boolean;
    crawledProductId?: number;
  },
  token?: string
): Promise<ProductUploadResponse> => {
  return apiRequest<ProductUploadResponse>({
    url: '/staged-products/from-template-and-upload',
    method: 'POST',
    data,
    token
  });
};
