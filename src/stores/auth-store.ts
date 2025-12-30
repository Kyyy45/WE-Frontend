import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

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
          // 1. Panggil backend untuk invalidasi token di DB
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout server error:", error);
        }

        // 2. Hapus Cookie Browser Secara Manual
        // Backend tidak bisa menghapus cookie ini karena dibuat oleh Frontend
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax; secure";

        // 3. Reset State Aplikasi
        set({ user: null, accessToken: null, isAuthenticated: false });

        // 4. Hapus Storage
        localStorage.removeItem("we-auth-storage");

        // 5. Redirect ke Login
        window.location.href = "/login";
      },
    }),
    {
      name: "we-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
