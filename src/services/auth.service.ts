import { fetcher } from "./api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponseData,
  ActivationSendRequest,
  ActivationVerifyRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

export const authService = {
  /**
   * Login user
   * Response: accessToken (Body), refreshToken (HttpOnly Cookie)
   */
  login: async (data: LoginRequest) => {
    return fetcher<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Register user baru
   * Mengirim kode aktivasi ke email setelah sukses
   */
  register: async (data: RegisterRequest) => {
    return fetcher<RegisterResponseData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout user
   * Menghapus cookie refreshToken di server dan browser
   */
  logout: async () => {
    return fetcher<void>("/auth/logout", {
      method: "POST",
    });
  },

  /**
   * Refresh Access Token
   * Menggunakan cookie refreshToken yang dikirim otomatis oleh browser
   */
  refreshToken: async () => {
    // Tidak perlu body, cookie dikirim otomatis via credentials: 'include' di fetcher
    return fetcher<AuthResponse>("/auth/refresh", {
      method: "POST",
    });
  },

  /**
   * Kirim ulang kode aktivasi ke email
   */
  sendActivationCode: async (data: ActivationSendRequest) => {
    return fetcher<void>("/auth/activation/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Verifikasi akun dengan kode OTP dari email
   */
  verifyActivation: async (data: ActivationVerifyRequest) => {
    return fetcher<void>("/auth/activation/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Request link reset password (Lupa Password)
   */
  forgotPassword: async (data: ForgotPasswordRequest) => {
    return fetcher<void>("/auth/password/request-reset", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Reset password menggunakan token dari email
   */
  resetPassword: async (data: ResetPasswordRequest) => {
    return fetcher<void>("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Mendapatkan URL Google Auth
   */
  getGoogleAuthUrl: () => {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },
};
