import { fetcher } from "./api";
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserListParams,
  UserListResponse,
  AdminUpdateUserRequest,
} from "@/types/user";

export const userService = {
  // ===== USER / PUBLIC ACCESS =====

  getMe: async () => {
    return fetcher<UserProfile>("/users/me");
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    return fetcher<UserProfile>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: ChangePasswordRequest) => {
    return fetcher<{ message: string }>("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Upload Avatar
   * PERBAIKAN: Tidak perlu lagi set header Content-Type manual.
   * fetcher() di api.ts otomatis mendeteksi FormData dan membiarkan browser mengaturnya.
   */
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return fetcher<{ message: string; data: UserProfile }>("/users/me/avatar", {
      method: "PATCH",
      body: formData,
    });
  },

  // ===== ADMIN ACCESS =====

  adminListUsers: async (params?: UserListParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.role) query.append("role", params.role);
    if (params?.status) query.append("status", params.status);

    return fetcher<UserListResponse>(`/users?${query.toString()}`);
  },

  adminGetUserById: async (id: string) => {
    return fetcher<UserProfile>(`/users/${id}`);
  },

  adminUpdateUser: async (id: string, data: AdminUpdateUserRequest) => {
    return fetcher<UserProfile>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  adminDeleteUser: async (id: string) => {
    return fetcher<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    });
  },
};