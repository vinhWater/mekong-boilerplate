export interface TikTokApplication {
  id: number;
  name: string;
  idTT: string;
  email: string;
  app_key: string;
  app_secret: string;
  app_type: string;
  redirect_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface TikTokShop {
  id: number;
  idTT: string;
  name: string;
  friendly_name: string;
  region: string;
  seller_type: string;
  cipher: string;
  code: string;
  app_key: string;
  auth_code: string;
  access_token: string;
  access_token_expire_in: string;
  refresh_token: string;
  refresh_token_expire_in: string;
  last_refreshed_at: string;
  assignedToUserId?: number | null;
  createdAt: string;
  updatedAt: string;
}

// Clean response DTO that matches backend TikTokShopCleanResponseDto
export interface TikTokShopClean {
  id: number;
  name: string;
  friendly_name?: string;
  region?: string;
  seller_type?: string;
  code: string;
  expired_in: string | number; // Handle as string or number for timestamp
  createdAt: string | Date;
  updatedAt: string | Date;
  last_refreshed_at: string | Date;
  currentPlan?: {
    id: number;
    name: string;
    displayName: string;
    maxUploadProductsPerMonth: number;
    maxFulfillOrdersPerMonth: number;
  };
  // Usage tracking fields
  currentCycleProductUploads?: number;
  currentCycleOrderFulfillments?: number;
}

// Warehouse interface that matches backend WarehouseResponseDto
export interface Warehouse {
  id: number;
  idTT: string;
  name: string;
  effectStatus: string;
  isDefault: boolean;
  subType?: string;
  type?: string;
  address: {
    fullAddress?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    region?: string;
    regionCode?: string;
    contactPerson?: string;
    phoneNumber?: string;
  };
  geolocation?: {
    latitude?: string;
    longitude?: string;
  };
  tiktokShopId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Enhanced shop detail interface with warehouses
export interface TikTokShopDetail extends TikTokShop {
  warehouses?: Warehouse[];
}

export interface ShopCleanListResponse {
  data: TikTokShopClean[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ShopListResponse {
  data: TikTokShop[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ApplicationListResponse {
  data: TikTokApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ShopSyncResponse {
  success: boolean;
  message: string;
  syncedShops: number;
}

export interface ApplicationSyncResponse {
  success: boolean;
  message: string;
  syncedApplications: number;
}

export interface ShopFilters {
  search?: string;
  status?: string;
  region?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  name?: string;
  code?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

// Admin response DTO for TikTok shops
export interface TikTokShopAdmin {
  id: number;
  idTT?: string;
  name: string;
  friendly_name?: string;
  region?: string;
  seller_type?: string;
  code?: string;
  app_key?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  last_refreshed_at?: string | Date;
  ownerEmail?: string | null;
  assignedEmail?: string | null;
  currentPlan?: {
    id: number;
    name: string;
    displayName: string;
    maxUploadProductsPerMonth: number;
    maxFulfillOrdersPerMonth: number;
  };
  currentCycleProductUploads?: number;
  currentCycleOrderFulfillments?: number;
}
