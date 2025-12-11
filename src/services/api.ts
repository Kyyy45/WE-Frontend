import { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit;

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Helper untuk ambil cookie di client-side (browser)
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  // 1. Content-Type Handling
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 2. Authorization Handling (Fix Double Toast Issue)
  // Otomatis inject token jika ada di cookie 'accessToken' dan belum ada header Authorization
  if (!headers.has("Authorization")) {
    const token = getCookie("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Untuk refreshToken cookie
  };

  try {
    const response = await fetch(url, config);
    
    let rawResult: unknown;
    if (response.status === 204) {
      rawResult = { success: true };
    } else {
      try {
        rawResult = await response.json();
      } catch {
        throw new ApiError("Invalid JSON response", response.status);
      }
    }

    const result = rawResult as ApiResponse<T>;

    if (!response.ok) {
      throw new ApiError(
        result.message || "Terjadi kesalahan pada server",
        response.status,
        result.errors || result.data
      );
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network Error",
      500
    );
  }
}