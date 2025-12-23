export type UserRole = "user" | "admin";
export type UserStatus = "pending" | "active" | "suspended";
export type AuthProvider = "local" | "google";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}
