import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth-store";

// URL Backend
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://we-backend-five.vercel.app/api';

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Wajib agar cookie dikirim/diterima
});

// Interface custom untuk config axios agar support properti _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 1. Request Interceptor: Tempel Access Token dari State jika ada
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface RetryQueueItem {
  resolve: (value: AxiosResponse | Promise<AxiosResponse>) => void;
  reject: (error?: unknown) => void;
  config: CustomAxiosRequestConfig;
}

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
      prom.resolve(api(prom.config));
    }
  });
  failedQueue = [];
};

// 2. Response Interceptor: Auto Refresh Token 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);

    // Jika error 401 dan belum pernah retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Jangan loop jika yang error adalah login atau refresh itu sendiri
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<AxiosResponse>(function (resolve, reject) {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Panggil endpoint refresh (Backend baca cookie refreshToken)
        const { data } = await api.post("/auth/refresh");
        
        // Backend return: { success: true, data: { accessToken: "..." } }
        const newAccessToken = data.data.accessToken;

        // Update state
        useAuthStore.getState().setAccessToken(newAccessToken);
        
        // Proses antrian
        processQueue(null, newAccessToken);

        // Ulangi request asli dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Token habis total -> Logout & Redirect Login
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);