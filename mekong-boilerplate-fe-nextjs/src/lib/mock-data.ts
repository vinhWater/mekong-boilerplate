// Mock data for the boilerplate application
// This file contains sample data to demonstrate the UI without a real backend

export const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    image: 'https://ui-avatars.com/api/?name=Admin+User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'manager@example.com',
    name: 'Manager User',
    image: 'https://ui-avatars.com/api/?name=Manager+User',
    role: 'manager',
    createdAt: '2024-01-02T00:00:00Z',
   updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    email: 'member@example.com',
    name: 'Member User',
    image: 'https://ui-avatars.com/api/?name=Member+User',
    role: 'member',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export const mockOrders = Array.from({ length: 50 }, (_, i) => ({
  id: `order-${i + 1}`,
  orderNumber: `MKB-${String(i + 1).padStart(6, '0')}`,
  customer: {
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
  },
  items: Math.floor(Math.random() * 5) + 1,
  totalAmount: (Math.random() * 1000 + 50).toFixed(2),
  status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockProducts = Array.from({ length: 30 }, (_, i) => ({
  id: `product-${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(4, '0')}`,
  name: `Product ${i + 1}`,
  description: `This is a sample product description for Product ${i + 1}. It's a great product!`,
  price: (Math.random() * 500 + 10).toFixed(2),
  stock: Math.floor(Math.random() * 1000),
  category: ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'][Math.floor(Math.random() * 5)],
  imageUrl: `https://picsum.photos/seed/product${i + 1}/400/400`,
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockStores = Array.from({ length: 5 }, (_, i) => ({
  id: `store-${i + 1}`,
  name: `Store ${i + 1}`,
  description: `Sample store description for Store ${i + 1}`,
  platform: ['tiktok', 'shopify', 'etsy', 'amazon'][Math.floor(Math.random() * 4)],
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
  url: `https://store${i + 1}.example.com`,
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockTransactions = Array.from({ length: 100 }, (_, i) => ({
  id: `txn-${i + 1}`,
  type: ['credit', 'debit'][Math.floor(Math.random() * 2)],
  amount: (Math.random() * 500 + 10).toFixed(2),
  description: `Transaction ${i + 1}`,
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const mockDesigns = Array.from({ length: 20 }, (_, i) => ({
  id: `design-${i + 1}`,
  name: `Design ${i + 1}`,
  description: `Sample design description for Design ${i + 1}`,
  thumbnailUrl: `https://picsum.photos/seed/design${i + 1}/300/300`,
  fileUrl: `https://example.com/designs/design-${i + 1}.ai`,
  tags: ['mockup', 'template', 'design'],
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockPrompts = Array.from({ length: 15 }, (_, i) => ({
  id: `prompt-${i + 1}`,
  title: `Prompt ${i + 1}`,
  content: `This is a sample AI prompt for generating content. Use this as a template.`,
  category: ['marketing', 'design', 'product', 'seo'][Math.floor(Math.random() * 4)],
  language: 'en',
  usageCount: Math.floor(Math.random() * 1000),
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockDashboardStats = {
  totalOrders: mockOrders.length,
  totalRevenue: mockOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0).toFixed(2),
  totalProducts: mockProducts.length,
  totalStores: mockStores.length,
  recentOrders: mockOrders.slice(0, 10),
  topProducts: mockProducts.slice(0, 5),
};

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Pagination helper
export function paginateData<T>(data: T[], page: number = 1, limit: number = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    meta: {
      totalItems: data.length,
      itemCount: paginatedData.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(data.length / limit),
      currentPage: page,
    },
  };
}
