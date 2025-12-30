import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";
import { api } from "@/lib/axios";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: async () => {
        try {
          // 1. Panggil API Logout Backend (untuk revoke token di DB)
          await api.post("/auth/logout");
        } catch (error) {
          console.error(
            "Logout backend failed, clearing local state anyway",
            error
          );
        } finally {
          // 2. [PENTING] Hapus Cookie Secara Manual di Frontend
          // Kita set tanggal kadaluarsa ke masa lalu agar browser menghapusnya
          document.cookie =
            "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax; secure";

          // 3. Reset State Aplikasi
          set({ user: null, accessToken: null, isAuthenticated: false });

          // 4. Redirect ke login (Opsional, biasanya ditangani di component)
          window.location.href = "/login";
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
