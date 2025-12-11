import { PaginatedResult, PaginationParams } from "./api";

// Enums (Sesuai user.model.ts)
export type UserRole = 'user' | 'admin';
export type UserStatus = 'pending' | 'active' | 'suspended';
export type AuthProvider = 'local' | 'google';

// User Profile Data (Sesuai UserMeResponse di docs)
export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt?: string;
}

// REQUEST PAYLOADS

export interface UpdateProfileRequest {
  username: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminUpdateUserRequest {
  fullName?: string;
  username?: string;
  role?: UserRole;
  status?: UserStatus;
}

// PARAMS & RESPONSE

export interface UserListParams extends PaginationParams {
  role?: UserRole;
  status?: UserStatus;
}

export type UserListResponse = PaginatedResult<UserProfile>;