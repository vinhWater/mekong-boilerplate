'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  getCrawledProducts,
  getCrawledProduct,
  createCrawledProduct,
  deleteCrawledProduct,
  bulkDeleteCrawledProducts,
  toggleCrawledProductPublic,
  shareSelectedProducts
} from '@/lib/api/services/crawled-products-service';
import {
  CreateCrawledProductDto,
  CrawledProductQueryDto
} from '@/types/crawled-product';
import { createQueryKeys } from '@/lib/api/api-client';

// Create query keys for crawled products
export const crawledProductKeys = createQueryKeys('crawledProducts');

/**
 * Hook for fetching crawled products with pagination and filtering
 */
export const useCrawledProducts = (filters: CrawledProductQueryDto = {}) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: crawledProductKeys.list(filters),
    queryFn: () => getCrawledProducts(filters, session?.backendToken),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching a single crawled product by ID
 */
export const useCrawledProduct = (id: number) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: crawledProductKeys.detail(id),
    queryFn: () => getCrawledProduct(id, session?.backendToken),
    enabled: isAuthenticated && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for creating a new crawled product
 */
export const useCreateCrawledProduct = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCrawledProductDto) => 
      createCrawledProduct(data, session?.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crawledProductKeys.lists() });
      toast.success('Crawled product created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create crawled product: ${error.message}`);
    },
  });
};

/**
 * Hook for deleting a crawled product
 */
export const useDeleteCrawledProduct = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCrawledProduct(id, session?.backendToken),

    // Optimistic update
    onMutate: async (deletedProductId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: crawledProductKeys.lists() });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(crawledProductKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(
        crawledProductKeys.lists(),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((product: any) => product.id !== deletedProductId)
          };
        }
      );

      return { previousProducts };
    },

    onError: (error: Error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(crawledProductKeys.lists(), context.previousProducts);
      }
      toast.error(`Failed to delete crawled product: ${error.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: crawledProductKeys.lists() });
    },

    onSuccess: () => {
      toast.success('Crawled product deleted successfully');
    }
  });
};

/**
 * Hook for bulk deleting crawled products
 */
export const useBulkDeleteCrawledProducts = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => bulkDeleteCrawledProducts(ids, session?.backendToken),

    // Optimistic update
    onMutate: async (deletedProductIds) => {
      await queryClient.cancelQueries({ queryKey: crawledProductKeys.lists() });

      const previousProducts = queryClient.getQueryData(crawledProductKeys.lists());

      queryClient.setQueryData(
        crawledProductKeys.lists(),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((product: any) => !deletedProductIds.includes(product.id))
          };
        }
      );

      return { previousProducts };
    },

    onError: (error: Error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(crawledProductKeys.lists(), context.previousProducts);
      }
      toast.error(`Failed to delete crawled products: ${error.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: crawledProductKeys.lists() });
    },

    onSuccess: (_, ids) => {
      toast.success(`${ids.length} crawled products deleted successfully`);
    }
  });
};

/**
 * Hook for toggling public status of crawled product
 */
export const useToggleCrawledProductPublic = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublic }: { id: number; isPublic: boolean }) =>
      toggleCrawledProductPublic(id, isPublic, session?.backendToken),
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        crawledProductKeys.detail(updatedProduct.id),
        updatedProduct
      );
      // Invalidate lists to refresh the table
      queryClient.invalidateQueries({ queryKey: crawledProductKeys.lists() });
      toast.success(`Product ${updatedProduct.isPublic ? 'shared publicly' : 'made private'} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update product visibility: ${error.message}`);
    },
  });
};

/**
 * Hook for sharing selected crawled products
 */
export const useShareSelectedProducts = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, isPublic }: { ids: number[]; isPublic: boolean }) =>
      shareSelectedProducts(ids, isPublic, session?.backendToken),
    onSuccess: (result) => {
      // Invalidate lists to refresh the table
      queryClient.invalidateQueries({ queryKey: crawledProductKeys.lists() });
      const action = result.products[0]?.isPublic ? 'shared publicly' : 'made private';
      toast.success(`${result.updatedCount} products ${action} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update products visibility: ${error.message}`);
    },
  });
};
