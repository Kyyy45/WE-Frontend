import { fetcher } from "./api";
import {
  Course,
  CourseListParams,
  CourseListResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";

export const courseService = {
  // ===== PUBLIC ACCESS =====

  /**
   * Get List Courses (Public)
   * Support pagination, search, dan filter level
   */
  getCourses: async (params?: CourseListParams) => {
    const query = new URLSearchParams();
    
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.level) query.append("level", params.level);

    return fetcher<CourseListResponse>(`/courses?${query.toString()}`);
  },

  /**
   * Get Course Detail by ID
   */
  getCourseById: async (id: string) => {
    return fetcher<Course>(`/courses/${id}`);
  },

  // ===== ADMIN ACCESS =====

  /**
   * [ADMIN] Create Course
   */
  createCourse: async (data: CreateCourseRequest) => {
    return fetcher<{ message: string; data: Course }>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * [ADMIN] Update Course
   */
  updateCourse: async (id: string, data: UpdateCourseRequest) => {
    return fetcher<{ message: string; data: Course }>(`/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * [ADMIN] Delete Course
   */
  deleteCourse: async (id: string) => {
    return fetcher<{ message: string }>(`/courses/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * [ADMIN] Upload Thumbnail
   * Menggunakan endpoint: PATCH /courses/:id/thumbnail
   * Otomatis dideteksi sebagai Multipart oleh fetcher baru
   */
  uploadThumbnail: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("thumbnail", file);

    return fetcher<{ message: string; data: Course }>(`/courses/${id}/thumbnail`, {
      method: "PATCH",
      body: formData,
    });
  },
};