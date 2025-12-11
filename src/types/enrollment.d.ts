import { PaginatedResult, PaginationParams } from "./api";
import { CourseLevel } from "./course";

// Enum Status & Source sesuai backend
export type EnrollmentStatus = 'pending' | 'active' | 'cancelled' | 'expired' | 'completed';
export type EnrollmentSource = 'manual' | 'payment' | 'free';

// Struktur Data Enrollment (termasuk populated course)
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  source: EnrollmentSource;
  createdAt: string;
  updatedAt: string;
  // Field course bersifat opsional (tergantung populate di backend)
  course?: {
    id: string;
    title: string;
    slug: string;
    level: CourseLevel;
    isFree: boolean;
    price: number;
    thumbnailUrl: string | null;
  };
}

// Params untuk Filter (Admin)
export interface EnrollmentListParams extends PaginationParams {
  userId?: string;
  courseId?: string;
  status?: EnrollmentStatus;
}

export type EnrollmentListResponse = PaginatedResult<Enrollment>;

// PAYLOADS

// User Enroll (Public/User)
export interface UserEnrollRequest {
  courseId: string;
}

// Admin Manual Create
export interface AdminCreateEnrollmentRequest {
  userId: string;
  courseId: string;
  status?: EnrollmentStatus;
}

// Admin Update Status
export interface AdminUpdateStatusRequest {
  status: EnrollmentStatus;
}