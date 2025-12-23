import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth-store";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // PENTING: Agar cookie (refreshToken) dikirim/diterima
});

// 1. Request Interceptor: Tempel Access Token otomatis
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ambil token dari Zustand Store (Memory)
    const token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Auto Refresh Token jika 401
interface RetryQueueItem {
  resolve: (value?: AxiosResponse) => void;
  reject: (error?: unknown) => void;
  config: InternalAxiosRequestConfig;
}

// Queue untuk menahan request yang gagal saat proses refresh sedang berjalan
let isRefreshing = false;
let failedQueue: RetryQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (prom.config.headers) {
        prom.config.headers.Authorization = `Bearer ${token}`;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prom.resolve(api(prom.config) as any);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Jika error 401 (Unauthorized) dan belum pernah retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Cek apakah url yang error adalah url login/refresh itu sendiri, jika iya jangan loop
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tembak endpoint refresh backend Anda
        // Backend mengharapkan refresh token dari cookie (handled by withCredentials: true)
        const { data } = await api.post("/auth/refresh");

        // Backend auth.controller.ts mengembalikan { accessToken } di dalam data
        const newAccessToken = data.data.accessToken;

        // Simpan token baru ke state
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Lanjut proses request yang tertunda
        processQueue(null, newAccessToken);

        // Update header request yang gagal tadi dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Jika refresh gagal (token expired habis), logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
