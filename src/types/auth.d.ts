export interface AuthResponse {
  accessToken: string;
  // Refresh token otomatis di-handle oleh browser via HttpOnly Cookie
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface ActivationSendRequest {
  email: string;
}

export interface ActivationVerifyRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponseData {
  userId: string;
  email: string;
}