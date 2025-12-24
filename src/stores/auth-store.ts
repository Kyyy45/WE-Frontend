import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  updateUser: (user: Partial<User>) => void;
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

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: async () => {
        try {
          // 1. Panggil Backend untuk hapus HTTP-Only Cookie
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout server error:", error);
        }

        // 2. Hapus state di Zustand
        set({ user: null, accessToken: null, isAuthenticated: false });

        // 3. Hapus paksa dari LocalStorage browser (sesuai nama 'key' Anda di bawah)
        localStorage.removeItem("we-auth-storage");

        // 4. Hard Refresh ke halaman login agar Middleware membaca ulang kondisi cookie kosong
        window.location.href = "/login";
      },
    }),
    {
      name: "we-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
