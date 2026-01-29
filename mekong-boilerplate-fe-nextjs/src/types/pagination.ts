/**
 * Interface for paginated API responses
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

/**
 * Interface for pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  // Support both naming conventions for backward compatibility
  limit?: number; // Legacy parameter name (used in some places)
  pageSize?: number; // New parameter name (matches backend API)
  sortField?: string;
  sortDirection?: 'asc' | 'desc'; // Legacy parameter name (used in some places)
  sortOrder?: 'asc' | 'desc'; // New parameter name (matches backend API)
}
