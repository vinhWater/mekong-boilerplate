'use client';

import { use } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CrawledProductDetails, DeleteConfirmationDialog } from '@/components/search';
import { useCrawledProduct, useDeleteCrawledProduct } from '@/lib/hooks/use-crawled-products-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function CrawledProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const productId = parseInt(id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch crawled product details
  const { data: product, isLoading, isError, error } = useCrawledProduct(productId);

  // Delete mutation
  const {
    mutate: deleteProduct,
    isPending: isDeleting
  } = useDeleteCrawledProduct();

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    deleteProduct(productId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        router.push('/client/search');
      },
    });
  };

  // Handle delete request
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // Handle back navigation with fallback
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/client/search');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <div className="rounded-md border border-destructive p-6">
          <p className="text-destructive">
            Error loading product: {error?.message || 'Unknown error'}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/client/search')}
          >
            Return to Search
          </Button>
        </div>
      ) : product ? (
        <CrawledProductDetails
          product={product}
          onDelete={handleDelete}
        />
      ) : (
        <div className="rounded-md border p-6">
          <p className="text-muted-foreground">
            Product not found. It may have been deleted or you don't have permission to view it.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/client/search')}
          >
            Return to Search
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Crawled Product"
        description="Are you sure you want to delete this crawled product? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
