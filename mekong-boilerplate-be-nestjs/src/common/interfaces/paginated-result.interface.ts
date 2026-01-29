export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number; // total number of items across all pages
    itemCount: number; // actual number of items returned in this response (<= limit)
    itemsPerPage: number; // limit per page
    totalPages: number; // total number of pages
    currentPage: number; // current page number
  };
}
