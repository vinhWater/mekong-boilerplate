'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePreview } from '@/components/ui/image-preview';
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
  Package,
  Eye,
  Upload,
  Heart,
  User,
  Clock,
  CheckCircle
} from 'lucide-react';
import { CrawledProduct } from '@/types/crawled-product';
import { cn } from '@/lib/utils';

interface CrawledProductsThumbnailProps {
  products: CrawledProduct[];
  isLoading: boolean;
  selectedProductIds: number[];
  onSelectAll: (selected: boolean) => void;
  onSelectProduct: (productId: number, selected: boolean) => void;
  onDelete: (productId: number) => void;
  onConvert: (product: CrawledProduct) => void;
}

export function CrawledProductsThumbnail({
  products,
  isLoading,
  selectedProductIds,
  onSelectAll,
  onSelectProduct,
  onDelete,
  onConvert,
}: CrawledProductsThumbnailProps) {
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
    if (reviewCount >= 1000) {
      return `${(reviewCount / 1000).toFixed(1)}k`;
    }
    return reviewCount.toLocaleString();
  };

  const getPrimaryImage = (product: CrawledProduct) => {
    return product.images?.find(img => img.isPrimary) || product.images?.[0];
  };

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} className="overflow-hidden" style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-3 sm:p-4 space-y-2">
              {/* Product title */}
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />

              {/* Seller info */}
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-muted animate-pulse rounded" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </div>

              {/* Review count */}
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-muted animate-pulse rounded" />
                <div className="h-3 w-12 bg-muted animate-pulse rounded" />
              </div>

              {/* Updated time */}
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-muted animate-pulse rounded" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No crawled products found</h3>
        <p className="text-muted-foreground mb-4">
          Start extracting products from marketplaces to see them here.
        </p>
        <Button
          variant="outline"
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
    <div className="space-y-6">
      {/* Select All Header */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
        />
        <span className="text-sm text-muted-foreground">
          {selectedProductIds.length > 0
            ? `${selectedProductIds.length} of ${products.length} selected`
            : `Select all ${products.length} products`
          }
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product) => {
          const primaryImage = getPrimaryImage(product);
          const isSelected = selectedProductIds.includes(product.id);
          const hasImageError = imageErrors.has(product.id);

          return (
            <Card
              key={product.id}
              className={cn(
                "overflow-hidden transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary bg-muted/30",
                product.hasStaged && "bg-green-300 dark:bg-green-900/50 border-green-200 dark:border-green-800 dark:text-green-400"
              )}
              style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-muted">
                {primaryImage && !hasImageError ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <ImagePreview
                      src={primaryImage.imageUrl}
                      alt={product.title}
                      productName={product.title}
                      thumbnailSize="h-full w-full"
                      className="aspect-square"
                      onError={() => handleImageError(product.id)}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-12 w-12" />
                  </div>
                )}

                {/* Selection Checkbox */}
                <div
                  className="absolute top-2 left-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                    className="bg-white/80 border-white/80"
                  />
                </div>

                {/* Actions Dropdown */}
                <div
                  className="absolute top-2 right-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white/90"
                      >
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
                </div>

                {/* Marketplace Badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", getMarketplaceBadgeColor(product.marketplace))}
                  >
                    {product.marketplace.toUpperCase()}
                  </Badge>
                </div>

                {/* Staged Indicator (bottom-right) */}
                {product.hasStaged && (
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant="secondary"
                      className="inline-flex items-center gap-1 bg-green-300 text-green-800 border-green-400 dark:bg-green-900/60 dark:text-green-300 dark:border-green-700 shadow-sm"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="text-[10px] sm:text-xs">Staged</span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <CardContent className="p-3 sm:p-4 space-y-2 relative z-20">
                <Link
                  href={`/client/search/${product.id}`}
                  className="font-medium text-xs sm:text-sm line-clamp-2 leading-tight hover:underline block"
                  title={product.title}
                >
                  {product.title}
                </Link>

                {/* Seller Info */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate" title={product.sellerName || 'Unknown'}>
                    {product.sellerName || 'Unknown'}
                  </span>
                </div>

                {/* Review Count */}
                {product.reviewCount !== undefined && product.reviewCount !== null && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3 w-3 fill-current flex-shrink-0" />
                    <span className="font-medium">{formatReviewCount(product.reviewCount)}</span>
                    <span className="hidden sm:inline">
                      {product.marketplace === 'etsy' ? 'favorites' : 'reviews'}
                    </span>
                  </div>
                )}

                {/* Updated Time */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{formatTimeAgo(product.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
