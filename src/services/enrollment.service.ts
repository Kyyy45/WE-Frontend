import { fetcher } from "./api";
import {
  Enrollment,
  EnrollmentListParams,
  EnrollmentListResponse,
  UserEnrollRequest,
  AdminCreateEnrollmentRequest,
  AdminUpdateStatusRequest,
} from "@/types/enrollment";

export const enrollmentService = {
  // ===== USER ACCESS =====

  /**
   * List Enrollment Saya
   * GET /enrollments/me
   */
  getMyEnrollments: async () => {
    return fetcher<Enrollment[]>("/enrollments/me");
  },

  /**
   * Detail Enrollment Saya untuk Course tertentu
   * GET /enrollments/me/:courseId
   */
  getMyEnrollmentForCourse: async (courseId: string) => {
    return fetcher<Enrollment>(`/enrollments/me/${courseId}`);
  },

  /**
   * Enroll ke Course (Gratis)
   * POST /enrollments
   */
  enrollUser: async (data: UserEnrollRequest) => {
    return fetcher<{ message: string; data: Enrollment }>("/enrollments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ===== ADMIN ACCESS =====

  /**
   * [ADMIN] List Semua Enrollment
   * GET /enrollments
   */
  adminListEnrollments: async (params?: EnrollmentListParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.userId) query.append("userId", params.userId);
    if (params?.courseId) query.append("courseId", params.courseId);
    if (params?.status) query.append("status", params.status);

    return fetcher<EnrollmentListResponse>(`/enrollments?${query.toString()}`);
  },

  /**
   * [ADMIN] Detail Enrollment by ID
   * GET /enrollments/:id
   */
  adminGetEnrollmentById: async (id: string) => {
    return fetcher<Enrollment>(`/enrollments/${id}`);
  },

  /**
   * [ADMIN] Create Enrollment Manual
   * POST /enrollments/admin/manual
   */
  adminCreateEnrollment: async (data: AdminCreateEnrollmentRequest) => {
    return fetcher<{ message: string; data: Enrollment }>("/enrollments/admin/manual", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * [ADMIN] Update Status Enrollment
   * PATCH /enrollments/:id/status
   */
  adminUpdateEnrollmentStatus: async (id: string, data: AdminUpdateStatusRequest) => {
    return fetcher<{ message: string; data: Enrollment }>(`/enrollments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * [ADMIN] Delete Enrollment
   * DELETE /enrollments/:id
   */
  adminDeleteEnrollment: async (id: string) => {
    return fetcher<{ message: string }>(`/enrollments/${id}`, {
      method: "DELETE",
    });
  },
};