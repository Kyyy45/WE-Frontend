import { PaginatedResult, PaginationParams } from "./api";

// Enum Level sesuai backend
export type CourseLevel = 'bk_paud' | 'sd' | 'smp' | 'sma' | 'umum';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  level: CourseLevel;
  isFree: boolean;
  price: number;
  thumbnailUrl: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Params untuk Filter & Search
export interface CourseListParams extends PaginationParams {
  level?: CourseLevel;
  // search sudah ada di PaginationParams
}

export type CourseListResponse = PaginatedResult<Course>;

// Payload Create/Update
export interface CreateCourseRequest {
  title: string;
  description?: string;
  level: CourseLevel;
  isFree: boolean;
  price?: number;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  level?: CourseLevel;
  isFree?: boolean;
  price?: number;
}