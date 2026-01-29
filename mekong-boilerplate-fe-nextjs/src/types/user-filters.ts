export interface UserFilters {
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  
  // Search filters
  email?: string;
  name?: string;
  
  // Date range filters
  createdDateFrom?: string; // ISO date string
  createdDateTo?: string;   // ISO date string
  
  // Role filter
  role?: string;
}
