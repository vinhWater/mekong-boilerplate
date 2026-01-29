'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ImagePreview } from '@/components/ui/image-preview';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  ExternalLink,
  Trash2,
  ArrowUpDown,
  Package,
  Eye,
  Upload,
  CheckCircle
} from 'lucide-react';
import { CrawledProduct } from '@/types/crawled-product';
// Removed date-fns import - using custom formatTimeAgo function

interface CrawledProductsTableProps {
  products: CrawledProduct[];
  isLoading: boolean;
  selectedProductIds: number[];
  onSelectAll: (selected: boolean) => void;
  onSelectProduct: (productId: number, selected: boolean) => void;
  onDelete: (productId: number) => void;
  onConvert: (product: CrawledProduct) => void;
  onSort: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

// Custom time formatting function
const formatTimeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
};

export function CrawledProductsTable({
  products,
  isLoading,
  selectedProductIds,
  onSelectAll,
  onSelectProduct,
  onDelete,
  onConvert,
  onSort,
  sortField,
  sortDirection
}: CrawledProductsTableProps) {
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (productId: number) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const getMarketplaceBadgeColor = (marketplace: string) => {
    switch (marketplace) {
      case 'etsy':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'ebay':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'amazon':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatReviewCount = (reviewCount?: number) => {
    if (reviewCount === undefined || reviewCount === null) return 'N/A';
    return reviewCount.toLocaleString();
  };

  const getPrimaryImage = (product: CrawledProduct) => {
    return product.images?.find(img => img.isPrimary) || product.images?.[0];
  };

  const getSecondaryImage = (product: CrawledProduct) => {
    const primaryImage = getPrimaryImage(product);
    return product.images?.find(img => img !== primaryImage) || product.images?.[1];
  };

  const SortableHeader = ({ field, children, className }: { field: string; children: React.ReactNode; className?: string }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 select-none ${className || ''}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
        {sortField === field && (
          <span className="text-xs">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead className="w-56">Images</TableHead>
              <TableHead className="max-w-xs">Product</TableHead>
              <TableHead>Marketplace</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="max-w-32">Seller</TableHead>
              <TableHead>Extracted</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><div className="h-4 w-4 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <div className="h-24 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-24 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell className="max-w-32"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No crawled products found</h3>
        <p className="text-muted-foreground">
          Start extracting products from marketplaces to see them here.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/client/auto-crawler')}
        >
          Go to Auto Crawler
        </Button>
      </div>
    );
  }

  const allSelected = products.length > 0 && products.every(product => selectedProductIds.includes(product.id));
  const someSelected = selectedProductIds.length > 0 && !allSelected;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead className="w-56">Images</TableHead>
            <SortableHeader field="title" className="max-w-xs">Product</SortableHeader>
            <SortableHeader field="reviewCount">Review</SortableHeader>
            <TableHead className="max-w-32">Seller</TableHead>
            <SortableHeader field="updatedAt">Updated</SortableHeader>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const primaryImage = getPrimaryImage(product);
            const secondaryImage = getSecondaryImage(product);
            const isSelected = selectedProductIds.includes(product.id);
            const hasImageError = imageErrors.has(product.id);

            return (
              <TableRow
                key={product.id}
                className={`${isSelected ? 'bg-muted/50' : ''} ${product.hasStaged ? 'bg-green-300 dark:bg-green-900/50 dark:text-green-400' : ''} ${product.hasStaged ? 'hover:bg-green-300 dark:hover:bg-green-900/50' : 'hover:bg-muted/30'}`}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    {primaryImage && !hasImageError ? (
                      <ImagePreview
                        src={primaryImage.imageUrl}
                        alt={product.title}
                        productName={product.title}
                        thumbnailSize="h-24 w-24"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                    {secondaryImage ? (
                      <ImagePreview
                        src={secondaryImage.imageUrl}
                        alt={product.title}
                        productName={product.title}
                        thumbnailSize="h-24 w-24"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs relative z-10">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/client/search/${product.id}`}
                      className="font-medium line-clamp-3 break-words whitespace-normal hover:underline block"
                      title={product.title}
                    >
                      {product.title}
                    </Link>
                    <div className="text-sm text-muted-foreground truncate">
                      ID: {product.marketId}
                    </div>
                      {product.hasStaged && (
                        <Badge
                          variant="secondary"
                          className="mt-1 inline-flex items-center gap-1 bg-green-300 text-green-800 border-green-400 dark:bg-green-900/60 dark:text-green-300 dark:border-green-700"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Staged</span>
                        </Badge>
                      )}

                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {formatReviewCount(product.reviewCount)}
                    </div>
                    {product.reviewCount && product.reviewCount > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {product.marketplace === 'etsy' ? 'favorites' : 'reviews'}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-32">
                  <div className="space-y-1">
                    <div className="font-medium truncate" title={product.sellerName}>
                      {product.sellerName || 'Unknown'}
                    </div>
                    {product.rating && (
                      <div className="text-sm text-muted-foreground">
                        ⭐ {product.rating}
                      </div>
                    )}
                  </div>
                  <div>
                    <Badge
                      variant="secondary"
                      className={getMarketplaceBadgeColor(product.marketplace)}
                    >
                      {product.marketplace.toUpperCase()}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatTimeAgo(product.updatedAt)}
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/client/search/${product.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(product.productUrl, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Original
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onConvert(product)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Remake for TikTok
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
