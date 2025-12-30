import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth-store";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://we-backend-five.vercel.app/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Mengizinkan pengiriman Cookie
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Interceptor Request: Sisipkan Access Token
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

// Queue Logic untuk menangani multiple request saat refreshing
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

// Interceptor Response: Handle 401 & Auto Refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);

    // Jika 401 Unauthorized dan belum pernah dicoba ulang
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Hindari loop jika endpoint login/refresh sendiri yang error
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
        // Ambil refreshToken dari store (State Management)
        const refreshToken = useAuthStore.getState().refreshToken;

        // Panggil Refresh API mengirim token via BODY (Hybrid Strategy)
        // Ini memastikan refresh berhasil meski Cookie diblokir browser
        const { data } = await api.post("/auth/refresh", {
          refreshToken: refreshToken,
        });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // Update State dengan token baru
        useAuthStore.getState().setAccessToken(newAccessToken);
        if (newRefreshToken) {
          useAuthStore.getState().setRefreshToken(newRefreshToken);
        }

        // Lanjutkan request yang tertunda
        processQueue(null, newAccessToken);

        // Ulangi request original dengan token baru
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Jika refresh gagal, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
