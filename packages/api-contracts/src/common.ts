export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: ApiErrorEnvelope;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  activeFilters?: Record<string, any>;
}

export interface ApiErrorEnvelope {
  code: string;
  message: string;
  details?: Array<{ field: string; issue: string }>;
  timestamp: string;
  path?: string;
}
