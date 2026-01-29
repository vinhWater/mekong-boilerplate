'use client';


import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CrawledProduct } from '@/types/crawled-product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Trash, 
  Upload, 
  Share, 
  Star,
  Calendar,
  User,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToggleCrawledProductPublic } from '@/lib/hooks/use-crawled-products-query';
import { ImagePreview } from '@/components/ui/image-preview';

interface CrawledProductDetailsProps {
  product: CrawledProduct;
  onDelete: () => void;
}

export function CrawledProductDetails({ product, onDelete }: CrawledProductDetailsProps) {
  const router = useRouter();
  const { mutate: togglePublic, isPending: isTogglingPublic } = useToggleCrawledProductPublic();

  const handleUploadToTikTok = () => {
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

  const handleViewOriginal = () => {
    window.open(product.productUrl, '_blank');
  };

  const handleSharePublic = () => {
    togglePublic({
      id: product.id,
      isPublic: !product.isPublic
    });
  };

  const getMarketplaceBadgeColor = (marketplace: string) => {
    switch (marketplace) {
      case 'etsy':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'ebay':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'amazon':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-muted-foreground">
            Extracted {formatDate(product.extractedAt)} • Last updated {formatDate(product.updatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleViewOriginal}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Original
          </Button>
          <Button
            variant="default"
            onClick={handleUploadToTikTok}
          >
            <Upload className="mr-2 h-4 w-4" />
            Remake for TikTok
          </Button>
          <Button
            variant="outline"
            onClick={handleSharePublic}
            disabled={isTogglingPublic}
          >
            <Share className="mr-2 h-4 w-4" />
            {isTogglingPublic
              ? 'Updating...'
              : product.isPublic
                ? 'Make Private'
                : 'Share Public'
            }
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="metadata">Additional Info</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {/* Priority Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Seller
                  </h3>
                  <p className="font-medium">{product.sellerName || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {product.marketplace === 'etsy' ? 'Favorites' : 'Reviews'}
                  </h3>
                  <p className="font-medium">
                    {product.reviewCount || 0} {product.marketplace === 'etsy' ? 'favorites' : 'reviews'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Marketplace</h3>
                  <Badge className={getMarketplaceBadgeColor(product.marketplace)}>
                    {product.marketplace.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Public</h3>
                  <Badge variant={product.isPublic ? "default" : "outline"}>
                    {product.isPublic ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          {(product.price || product.originalPrice) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.price && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Price</h3>
                      <p className="text-lg font-semibold">{product.price}</p>
                    </div>
                  )}
                  {product.originalPrice && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Original Price</h3>
                      <p className="text-lg font-semibold line-through text-muted-foreground">{product.originalPrice}</p>
                    </div>
                  )}
                  {product.currency && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Currency</h3>
                      <p className="font-medium">{product.currency}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating Information */}
          {product.rating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{product.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`star-${i}`}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviewCount || 0} {product.marketplace === 'etsy' ? 'favorites' : 'reviews'})
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{product.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Extraction Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Extraction Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Extracted At</h3>
                  <p>{formatDate(product.extractedAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                  <p>{formatDate(product.updatedAt)}</p>
                </div>
                {product.marketId && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Market ID</h3>
                    <p className="font-mono text-sm">{product.marketId}</p>
                  </div>
                )}
                {product.availability && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Availability</h3>
                    <p>{product.availability}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Images extracted from the marketplace product page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={image.id || `image-${index}`} className="relative aspect-square rounded-md overflow-hidden border">
                      {image.imageUrl && (
                        <>
                          <ImagePreview
                            src={image.imageUrl}
                            alt={`Product image ${index + 1}`}
                            thumbnailSize="h-full w-full"
                            className="aspect-square"
                          />
                          {image.isPrimary && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="default" className="text-xs">
                                Primary
                              </Badge>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">No images available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Additional metadata and technical details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Product URL</h3>
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {product.productUrl}
                  </a>
                </div>
                {product.sellerUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Seller URL</h3>
                    <a
                      href={product.sellerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {product.sellerUrl}
                    </a>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Product ID</h3>
                  <p className="font-mono text-sm">{product.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Manager ID</h3>
                  <p className="font-mono text-sm">{product.managerId || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Created At</h3>
                  <p>{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Images</h3>
                  <p>{product.images?.length || 0} images</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
