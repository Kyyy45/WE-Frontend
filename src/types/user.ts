export type UserRole = "user" | "admin";
export type UserStatus = "pending" | "active" | "suspended";
export type AuthProvider = "local" | "google";

export interface User {
  id?: string;
  _id?: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  createdAt: string;
}

// Helper untuk response pagination backend
export interface UserResponse {
  items: User[];
  meta?: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}