export interface CrawledProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CrawledProduct {
  id: number;
  title: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  currency?: string;
  availability?: string;
  marketplace: 'etsy' | 'ebay' | 'amazon';
  productUrl: string;
  sellerName?: string;
  sellerUrl?: string;
  rating?: number;
  reviewCount?: number;
  images: CrawledProductImage[];
  extractedAt: string;
  isPublic: boolean;
  marketId?: string;
  managerId?: number; // Manager ID (team-level ownership, changed from userId)
  createdAt: string;
  updatedAt: string;
  hasStaged?: boolean; // derived from staged_products for current team
}

export interface CreateCrawledProductDto {
  title: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  currency?: string;
  availability?: string;
  marketplace: 'etsy' | 'ebay' | 'amazon';
  productUrl: string;
  sellerName?: string;
  sellerUrl?: string;
  rating?: number;
  reviewCount?: number;
  images?: Array<{
    imageUrl: string;
    isPrimary: boolean;
  }>;
  extractedAt?: string;
  isPublic?: boolean;
  marketId?: string;
}

export interface CrawledProductQueryDto {
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  title?: string;
  marketplace?: 'etsy' | 'ebay' | 'amazon';
  sellerName?: string;
  minReviewCount?: number;
  maxReviewCount?: number;
  extractedAfter?: string;
  extractedBefore?: string;
  isPublic?: boolean;
}

export interface CrawledProductFilters extends CrawledProductQueryDto {
  // Additional UI-specific filter properties can be added here
}
