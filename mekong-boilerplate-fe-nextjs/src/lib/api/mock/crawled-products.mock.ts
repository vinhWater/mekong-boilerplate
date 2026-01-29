'use client';

import { CrawledProduct, CreateCrawledProductDto, CrawledProductQueryDto } from '@/types/crawled-product';
import { PaginatedResult } from '@/types/pagination';

// Mock data storage (simulates a database)
let mockCrawledProducts: CrawledProduct[] = [
  {
    id: 1,
    title: 'Summer Beach T-Shirt',
    marketplace: 'etsy',
    productUrl: 'https://example.com/product/1',
    rating: 4.5,
    reviewCount: 120,
    price: '15.99',
    currency: 'USD',
    images: [
      { id: 1, imageUrl: 'https://picsum.photos/seed/product1/400/400', isPrimary: true, createdAt: new Date('2024-01-15T10:00:00Z').toISOString(), updatedAt: new Date('2024-01-15T10:00:00Z').toISOString() },
      { id: 2, imageUrl: 'https://picsum.photos/seed/product1-2/400/400', isPrimary: false, createdAt: new Date('2024-01-15T10:00:00Z').toISOString(), updatedAt: new Date('2024-01-15T10:00:00Z').toISOString() },
    ],
    extractedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    isPublic: false,
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T14:30:00Z').toISOString(),
  },
  {
    id: 2,
    title: 'Wireless Bluetooth Headphones',
    marketplace: 'amazon',
    productUrl: 'https://example.com/product/2',
    rating: 4.8,
    reviewCount: 350,
    price: '49.99',
    currency: 'USD',
    images: [
      { id: 3, imageUrl: 'https://picsum.photos/seed/product2/400/400', isPrimary: true, createdAt: new Date('2024-01-16T11:00:00Z').toISOString(), updatedAt: new Date('2024-01-16T11:00:00Z').toISOString() },
      { id: 4, imageUrl: 'https://picsum.photos/seed/product2-2/400/400', isPrimary: false, createdAt: new Date('2024-01-16T11:00:00Z').toISOString(), updatedAt: new Date('2024-01-16T11:00:00Z').toISOString() },
    ],
    extractedAt: new Date('2024-01-16T11:00:00Z').toISOString(),
    isPublic: true,
    createdAt: new Date('2024-01-16T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-21T09:15:00Z').toISOString(),
  },
  {
    id: 3,
    title: 'Smart Watch Fitness Tracker',
    marketplace: 'ebay',
    productUrl: 'https://example.com/product/3',
    rating: 4.2,
    reviewCount: 89,
    price: '79.99',
    currency: 'USD',
    images: [
      { id: 5, imageUrl: 'https://picsum.photos/seed/product3/400/400', isPrimary: true, createdAt: new Date('2024-01-17T12:00:00Z').toISOString(), updatedAt: new Date('2024-01-17T12:00:00Z').toISOString() },
    ],
    extractedAt: new Date('2024-01-17T12:00:00Z').toISOString(),
    isPublic: false,
    createdAt: new Date('2024-01-17T12:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-22T16:45:00Z').toISOString(),
  },
  {
    id: 4,
    title: 'Eco-Friendly Water Bottle',
    marketplace: 'etsy',
    productUrl: 'https://example.com/product/4',
    rating: 4.6,
    reviewCount: 210,
    price: '12.50',
    currency: 'USD',
    images: [
      { id: 6, imageUrl: 'https://picsum.photos/seed/product4/400/400', isPrimary: true, createdAt: new Date('2024-01-18T13:00:00Z').toISOString(), updatedAt: new Date('2024-01-18T13:00:00Z').toISOString() },
      { id: 7, imageUrl: 'https://picsum.photos/seed/product4-2/400/400', isPrimary: false, createdAt: new Date('2024-01-18T13:00:00Z').toISOString(), updatedAt: new Date('2024-01-18T13:00:00Z').toISOString() },
      { id: 8, imageUrl: 'https://picsum.photos/seed/product4-3/400/400', isPrimary: false, createdAt: new Date('2024-01-18T13:00:00Z').toISOString(), updatedAt: new Date('2024-01-18T13:00:00Z').toISOString() },
    ],
    extractedAt: new Date('2024-01-18T13:00:00Z').toISOString(),
    isPublic: true,
    createdAt: new Date('2024-01-18T13:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-23T11:20:00Z').toISOString(),
  },
  {
    id: 5,
    title: 'Premium Leather Wallet',
    marketplace: 'amazon',
    productUrl: 'https://example.com/product/5',
    rating: 4.9,
    reviewCount: 450,
    price: '35.00',
    currency: 'USD',
    images: [
      { id: 9, imageUrl: 'https://picsum.photos/seed/product5/400/400', isPrimary: true, createdAt: new Date('2024-01-19T14:00:00Z').toISOString(), updatedAt: new Date('2024-01-19T14:00:00Z').toISOString() },
    ],
    extractedAt: new Date('2024-01-19T14:00:00Z').toISOString(),
    isPublic: false,
    createdAt: new Date('2024-01-19T14:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-24T13:30:00Z').toISOString(),
  },
  {
    id: 6,
    title: 'Yoga Mat with Alignment Lines',
    marketplace: 'ebay',
    productUrl: 'https://example.com/product/6',
    rating: 4.3,
    reviewCount: 175,
    price: '28.99',
    currency: 'USD',
    images: [
      { id: 10, imageUrl: 'https://picsum.photos/seed/product6/400/400', isPrimary: true, createdAt: new Date('2024-01-20T15:00:00Z').toISOString(), updatedAt: new Date('2024-01-20T15:00:00Z').toISOString() },
      { id: 11, imageUrl: 'https://picsum.photos/seed/product6-2/400/400', isPrimary: false, createdAt: new Date('2024-01-20T15:00:00Z').toISOString(), updatedAt: new Date('2024-01-20T15:00:00Z').toISOString() },
    ],
    extractedAt: new Date('2024-01-20T15:00:00Z').toISOString(),
    isPublic: true,
    createdAt: new Date('2024-01-20T15:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-25T10:00:00Z').toISOString(),
  },
];

let nextId = 7;

/**
 * Simulate API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Apply filters and sorting to mock data
 */
const applyFilters = (
  products: CrawledProduct[],
  params?: CrawledProductQueryDto
): CrawledProduct[] => {
  let filtered = [...products];

  // Filter by title
  if (params?.title) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(params.title!.toLowerCase())
    );
  }

  // Filter by marketplace
  if (params?.marketplace) {
    filtered = filtered.filter(p => p.marketplace === params.marketplace);
  }

  // Filter by seller name
  if (params?.sellerName) {
    filtered = filtered.filter(p => 
      p.sellerName?.toLowerCase().includes(params.sellerName!.toLowerCase())
    );
  }

  // Filter by review count range
  if (params?.minReviewCount !== undefined) {
    filtered = filtered.filter(p => (p.reviewCount || 0) >= params.minReviewCount!);
  }
  if (params?.maxReviewCount !== undefined) {
    filtered = filtered.filter(p => (p.reviewCount || 0) <= params.maxReviewCount!);
  }

  // Filter by public status
  if (params?.isPublic !== undefined) {
    filtered = filtered.filter(p => p.isPublic === params.isPublic);
  }

  // Filter by extraction date range
  if (params?.extractedAfter) {
    filtered = filtered.filter(p => p.extractedAt >= params.extractedAfter!);
  }
  if (params?.extractedBefore) {
    filtered = filtered.filter(p => p.extractedAt <= params.extractedBefore!);
  }

  // Apply sorting
  const sortField = params?.sortField || 'updatedAt';
  const sortDirection = params?.sortDirection || 'desc';

  filtered.sort((a, b) => {
    let aValue: any = a[sortField as keyof CrawledProduct];
    let bValue: any = b[sortField as keyof CrawledProduct];

    // Handle date strings
    if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'extractedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};

/**
 * Mock: Get crawled products with pagination and filtering
 */
export const getMockCrawledProducts = async (
  params?: CrawledProductQueryDto
): Promise<PaginatedResult<CrawledProduct>> => {
  await delay();

  const filtered = applyFilters(mockCrawledProducts, params);

  // Apply pagination
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      totalItems: filtered.length,
      itemCount: paginatedData.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: page,
    },
  };
};

/**
 * Mock: Get a single crawled product by ID
 */
export const getMockCrawledProduct = async (id: number): Promise<CrawledProduct> => {
  await delay();

  const product = mockCrawledProducts.find(p => p.id === id);
  if (!product) {
    throw new Error(`Crawled product with ID ${id} not found`);
  }

  return product;
};

/**
 * Mock: Create a new crawled product
 */
export const createMockCrawledProduct = async (
  data: CreateCrawledProductDto
): Promise<CrawledProduct> => {
  await delay();

  const now = new Date().toISOString();
  const newProduct: CrawledProduct = {
    id: nextId++,
    title: data.title,
    description: data.description,
    price: data.price,
    originalPrice: data.originalPrice,
    currency: data.currency,
    availability: data.availability,
    marketplace: data.marketplace,
    productUrl: data.productUrl,
    sellerName: data.sellerName,
    sellerUrl: data.sellerUrl,
    rating: data.rating,
    reviewCount: data.reviewCount,
    images: data.images?.map((img, idx) => ({
      id: nextId + idx,
      imageUrl: img.imageUrl,
      isPrimary: img.isPrimary,
      createdAt: now,
      updatedAt: now,
    })) || [],
    extractedAt: data.extractedAt || now,
    isPublic: data.isPublic || false,
    marketId: data.marketId,
    createdAt: now,
    updatedAt: now,
  };

  mockCrawledProducts.push(newProduct);

  return newProduct;
};

/**
 * Mock: Delete a crawled product
 */
export const deleteMockCrawledProduct = async (id: number): Promise<void> => {
  await delay();

  const index = mockCrawledProducts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Crawled product with ID ${id} not found`);
  }

  mockCrawledProducts.splice(index, 1);
};

/**
 * Mock: Bulk delete crawled products
 */
export const bulkDeleteMockCrawledProducts = async (ids: number[]): Promise<void> => {
  await delay();

  mockCrawledProducts = mockCrawledProducts.filter(p => !ids.includes(p.id));
};

/**
 * Mock: Toggle public status of a crawled product
 */
export const toggleMockCrawledProductPublic = async (
  id: number,
  isPublic: boolean
): Promise<CrawledProduct> => {
  await delay();

  const product = mockCrawledProducts.find(p => p.id === id);
  if (!product) {
    throw new Error(`Crawled product with ID ${id} not found`);
  }

  product.isPublic = isPublic;
  product.updatedAt = new Date().toISOString();

  return product;
};

/**
 * Mock: Share selected crawled products (bulk update public status)
 */
export const shareMockSelectedProducts = async (
  ids: number[],
  isPublic: boolean
): Promise<{ message: string; updatedCount: number; products: CrawledProduct[] }> => {
  await delay();

  const updatedProducts: CrawledProduct[] = [];

  ids.forEach(id => {
    const product = mockCrawledProducts.find(p => p.id === id);
    if (product) {
      product.isPublic = isPublic;
      product.updatedAt = new Date().toISOString();
      updatedProducts.push(product);
    }
  });

  return {
    message: `${updatedProducts.length} products updated successfully`,
    updatedCount: updatedProducts.length,
    products: updatedProducts,
  };
};
