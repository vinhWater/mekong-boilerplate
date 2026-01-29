'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchFilters } from '@/components/search/search-filters';
import { CrawledProductsTable } from '@/components/search/crawled-products-table';
import { CrawledProductsThumbnail } from '@/components/search/crawled-products-thumbnail';
import { LayoutToggle } from '@/components/search/layout-toggle';
import {
  useCrawledProducts,
  useDeleteCrawledProduct,
  useBulkDeleteCrawledProducts,
  useShareSelectedProducts
} from '@/lib/hooks/use-crawled-products-query';
import { useCrawledProductsStore } from '@/lib/store/crawled-products-store';
import { CrawledProduct } from '@/types/crawled-product';
import {
  Search,
  RefreshCw,
  Trash,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Share,
  Upload
} from 'lucide-react';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);

  // Use Zustand store for persistent state
  const {
    filters,
    setFilters,
    resetFilters,
    selectedProductIds,
    toggleSelectAll,
    addSelectedProductId,
    removeSelectedProductId,
    clearSelectedProductIds,
    isFiltersPanelOpen,
    setFiltersPanelOpen,
    layout,
    setLayout
  } = useCrawledProductsStore();

  // Fetch crawled products with filters
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts
  } = useCrawledProducts(filters);

  // Mutations
  const {
    mutate: deleteProduct,
    isPending: isDeleting
  } = useDeleteCrawledProduct();

  const {
    mutate: bulkDeleteProducts,
    isPending: isBulkDeleting
  } = useBulkDeleteCrawledProducts();

  const {
    mutate: shareSelectedProducts,
    isPending: isSharing
  } = useShareSelectedProducts();

  // Handle URL parameters (e.g., productId from extension)
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      // Highlight or scroll to specific product
      // This could be implemented to show product details or highlight it
      console.log('Navigated to product:', productId);
    }
  }, [searchParams]);

  // Load search query from filters on mount
  useEffect(() => {
    if (filters.title) {
      setSearchQuery(filters.title);
    }
  }, []);

  // Handle search
  const handleSearch = () => {
    setFilters({
      title: searchQuery,
      page: 1, // Reset to first page on new search
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [sortField, sortDirection] = value.split('-');
    setFilters({
      sortField,
      sortDirection: sortDirection as 'asc' | 'desc',
      page: 1, // Reset to first page on sort change
    });
  };

  // Handle table sorting
  const handleTableSort = (field: string) => {
    const newDirection =
      filters.sortField === field && filters.sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    setFilters({
      sortField: field,
      sortDirection: newDirection,
      page: 1,
    });
  };

  // Handle select all products
  const handleSelectAll = (selected: boolean) => {
    const allProductIds = productsData?.data.map((product: any) => product.id) || [];
    toggleSelectAll(allProductIds, selected);
  };

  // Handle select single product
  const handleSelectProduct = (productId: number, selected: boolean) => {
    if (selected) {
      addSelectedProductId(productId);
    } else {
      removeSelectedProductId(productId);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (productIdToDelete) {
      // Single product delete
      deleteProduct(productIdToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setProductIdToDelete(null);
          clearSelectedProductIds();
        },
      });
    } else if (selectedProductIds.length > 0) {
      // Bulk delete
      bulkDeleteProducts(selectedProductIds, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          clearSelectedProductIds();
        },
      });
    }
  };

  // Handle delete request
  const handleDelete = (productId: number) => {
    setProductIdToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  // Handle upload to TikTok (navigate to from-template page with auto-fill)
  const handleConvert = (product: CrawledProduct) => {
    // Prepare crawled product data for auto-filling
    const timestamp = Date.now();
    const crawledProductData = {
      title: product.title,
      crawledProductId: product.id,
      images: product.images
        .filter(img => img.imageUrl) // Only include images with valid URLs
        .map((img, index) => ({
          id: `crawled-${img.id || `${timestamp}-${index}`}`,
          type: 'url' as const,
          src: img.imageUrl,
          isCover: img.isPrimary,
        }))
    };

    // Navigate to from-template page with auto-fill data
    const searchParams = new URLSearchParams({
      autoFill: JSON.stringify(crawledProductData)
    });

    router.push(`/client/tiktok/upload/from-template?${searchParams.toString()}`);
  };

  // Handle share selected products
  const handleShareSelected = (isPublic: boolean) => {
    if (selectedProductIds.length > 0) {
      shareSelectedProducts(
        { ids: selectedProductIds, isPublic },
        {
          onSuccess: () => {
            clearSelectedProductIds();
          },
        }
      );
    }
  };

  // Handle bulk upload to TikTok
  const handleBulkUploadToTikTok = () => {
    if (selectedProductIds.length === 0) return;

    // Get selected products data
    const selectedProducts = (productsData?.data || []).filter(product =>
      selectedProductIds.includes(product.id)
    );

    if (selectedProducts.length === 0) return;

    // Prepare bulk upload data
    const bulkUploadData = {
      products: selectedProducts.map(product => ({
        id: product.id,
        title: product.title,
        images: product.images
          .filter(img => img.imageUrl) // Only include images with valid URLs
          .map((img, index) => ({
            id: `crawled-${img.id || `${Date.now()}-${index}`}`,
            type: 'url' as const,
            src: img.imageUrl,
            isCover: img.isPrimary,
          }))
      })),
      timestamp: Date.now()
    };

    // Store data in sessionStorage
    sessionStorage.setItem('bulkUploadData', JSON.stringify(bulkUploadData));

    // Navigate to bulk upload page
    router.push('/client/tiktok/upload/bulk-from-template');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Crawled Products</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchProducts()}
            disabled={isLoadingProducts}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
            Refetch
          </Button>
          <LayoutToggle
            currentLayout={layout}
            onLayoutChange={setLayout}
          />
          <Select
            value={`${filters.sortField || 'updatedAt'}-${filters.sortDirection || 'desc'}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt-desc">Newest first</SelectItem>
              <SelectItem value="updatedAt-asc">Oldest first</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="reviewCount-desc">Review: High to Low</SelectItem>
              <SelectItem value="reviewCount-asc">Review: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
        isOpen={isFiltersPanelOpen}
        onToggle={() => setFiltersPanelOpen(!isFiltersPanelOpen)}
      />

      {/* Bulk Actions */}
      {selectedProductIds.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleShareSelected(true)}
            disabled={isSharing}
          >
            <Share className="mr-2 h-4 w-4" />
            Share Selected ({selectedProductIds.length})
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkUploadToTikTok}
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            Remake for TikTok ({selectedProductIds.length})
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive hover:text-white"
            onClick={() => {
              setProductIdToDelete(null); // Indicates bulk delete
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected ({selectedProductIds.length})
          </Button>
        </div>
      )}

      {/* Products Display */}
      {layout === 'table' ? (
        <CrawledProductsTable
          products={productsData?.data || []}
          isLoading={isLoadingProducts}
          selectedProductIds={selectedProductIds}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
          onDelete={handleDelete}
          onConvert={handleConvert}
          onSort={handleTableSort}
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
        />
      ) : (
        <CrawledProductsThumbnail
          products={productsData?.data || []}
          isLoading={isLoadingProducts}
          selectedProductIds={selectedProductIds}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
          onDelete={handleDelete}
          onConvert={handleConvert}
        />
      )}

      {/* Pagination */}
      {productsData && productsData.meta.totalItems > 0 && (
        <Card className="pt-0" style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
          <CardFooter className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <Select
                value={filters.limit?.toString() || "20"}
                onValueChange={(value) => setFilters({ limit: parseInt(value), page: 1 })}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Showing {productsData.data.length} of {productsData.meta.totalItems} items
              </span>
            </div>

            <Pagination>
              <PaginationContent>
                {/* First page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setFilters({ page: 1 })}
                    disabled={(filters.page || 1) <= 1 || isLoadingProducts}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">Go to first page</span>
                  </Button>
                </PaginationItem>

                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => (filters.page || 1) > 1 ? setFilters({ page: Math.max(1, (filters.page || 1) - 1) }) : undefined}
                    disabled={(filters.page || 1) <= 1 || isLoadingProducts}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="sr-only">Go to previous page</span>
                  </Button>
                </PaginationItem>

                {/* Current page indicator */}
                <PaginationItem>
                  <span className="px-4 py-2">
                    Page {filters.page || 1} of {productsData.meta.totalPages || 1}
                  </span>
                </PaginationItem>

                {/* Next page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => (filters.page || 1) < (productsData.meta.totalPages || 1) ? setFilters({ page: (filters.page || 1) + 1 }) : undefined}
                    disabled={(filters.page || 1) >= (productsData.meta.totalPages || 1) || isLoadingProducts}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="sr-only">Go to next page</span>
                  </Button>
                </PaginationItem>

                {/* Last page button */}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setFilters({ page: productsData.meta.totalPages })}
                    disabled={(filters.page || 1) >= (productsData.meta.totalPages || 1) || isLoadingProducts}
                  >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Go to last page</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {productIdToDelete ? "Delete Product" : "Delete Selected Products"}
            </DialogTitle>
            <DialogDescription>
              {productIdToDelete
                ? "Are you sure you want to delete this crawled product? This action cannot be undone."
                : `Are you sure you want to delete ${selectedProductIds.length} selected products? This action cannot be undone.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting || isBulkDeleting}
            >
              {isDeleting || isBulkDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Search Products</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
