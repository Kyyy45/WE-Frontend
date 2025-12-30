// Wrapper response standar (res.json({ success: true, ... }))
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, unknown>[] | string | null;
}

// Wrapper untuk pagination (listCourses, listUsers, dll)
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}