export interface StagedProduct {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  brandId: number;
  crawledProductId?: number;
  categoryVersion?: string;
  category?: {
    id: number;
    name: string;
    localName: string;
    idTT: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  images?: ProductImageInput[];
  productAttributes?: Array<{
    id: string;
    name?: string;
    values: Array<{
      id?: string;
      name?: string;
    }>;
  }>;
  skus: Array<{
    salesAttributes: Array<{
      name: string;
      valueName: string;
      skuImg?: {
        imageUrl?: string;
        r2Key?: string;
        uri?: string;
      };
      supplementarySkuImages?: {
        imageUrl?: string;
        r2Key?: string;
        uri?: string;
      }[];
    }>;
    inventory: Array<{
      quantity: number;
      warehouseId?: string;
    }>;
    price: {
      amount: number;
      currency: string;
    };
    listPrice?: {
      amount: number;
      currency: string;
    };
    identifierCode?: {
      code: string;
      type: string;
    };
    sellerSku?: string;
  }>;
  packageDimensions?: {
    unit: string;
    width: string;
    height: string;
    length: string;
  };
  packageWeight?: {
    unit: string;
    value: string;
  };
  sizeChart?: ProductImageInput; // Added size chart field
  userId: number; // Creator
  managerId?: number; // Team owner (for team sharing)
  createdAt: string;
  updatedAt: string;
  uploadResults?: ProductUpload[];
}

export interface ProductUpload {
  id: number;
  stagedProductId: number;
  tiktokShopId: number;
  shopFriendlyName?: string;
  shopCode?: string;
  status: ProductUploadStatus;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  tiktokProductId?: string;
}

export enum ProductUploadStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ProductImageInput {
  imageUrl?: string;   // URL of the image
  r2Key?: string;      // R2 storage key
}

export interface StagedProductCreateInput {
  title: string;
  description: string;
  categoryId: number;
  brandId: number;
  categoryVersion?: string;
  images: ProductImageInput[]; // Changed from productImages to images to match backend DTO
  productAttributes: Array<{
    id: string;
    name?: string;
    values: Array<{
      id?: string;
      name?: string;
    }>;
  }>;
  skus: Array<{
    salesAttributes: Array<{
      name: string;
      valueName: string;
      skuImg?: {
        imageUrl?: string;
        r2Key?: string;
        uri?: string;
      };
      supplementarySkuImages?: {
        imageUrl?: string;
        r2Key?: string;
        uri?: string;
      }[];
    }>;
    inventory: Array<{
      quantity: number;
    }>;
    price: {
      amount: number;
      currency: string;
    };
    listPrice?: {
      amount: number;
      currency: string;
    };
    identifierCode?: {
      code: string;
      type: string;
    };
    sellerSku?: string;
  }>;
  packageDimensions?: {
    unit: string;
    width: string;
    height: string;
    length: string;
  };
  packageWeight?: {
    unit: string;
    value: string;
  };
  sizeChart?: ProductImageInput; // Added size chart field
}

export type StagedProductUpdateInput = Partial<StagedProductCreateInput>;

export interface StagedProductFilters {
  title?: string;
  categoryId?: number;
  brandId?: number;
  updatedAfter?: string;
  updatedBefore?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

// New interface for the latest upload information
export interface LatestUploadInfo {
  id: number;
  status: ProductUploadStatus;
  tiktokShopId: number;
  shopFriendlyName?: string;
  createdAt: string;
  completedAt?: string;
}

// New interface for the combined product and upload response
export interface StagedProductWithUpload {
  product: StagedProduct;
  latestUpload?: LatestUploadInfo;
}

export interface StagedProductListResponse {
  data: StagedProductWithUpload[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ProductUploadCreateInput {
  stagedProductId: number;
  tiktokShopId: number;
}

export interface ProductUploadFilters {
  stagedProductId?: number;
  tiktokShopId?: number;
  status?: ProductUploadStatus;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProductUploadListResponse {
  data: ProductUpload[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ProductUploadResponse {
  id: number;
  stagedProductId: number;
  tiktokShopId: number;
  status: ProductUploadStatus;
  tiktokProductId?: string;
  errorMessage?: string;
  jobId?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  shopFriendlyName?: string;
  shopCode?: string;
  stagedProductTitle?: string;
}

export interface ProductUploadStatusResponse {
  id: number;
  status: ProductUploadStatus;
  progress: number;
  tiktokProductId?: string;
  errorMessage?: string;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
