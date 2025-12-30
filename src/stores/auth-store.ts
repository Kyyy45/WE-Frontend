import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setRefreshToken: (refreshToken) => set({ refreshToken }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: async () => {
        try {
          // Kirim refreshToken via body agar backend bisa menghapusnya dari DB
          // meskipun cookie browser diblokir/tidak terkirim.
          const { refreshToken } = get();
          await api.post("/auth/logout", { refreshToken });
        } catch (error) {
          console.error("Logout server error:", error);
        }

        // Hapus cookie browser secara paksa
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax; secure";

        // Reset seluruh state auth
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        localStorage.removeItem("we-auth-storage");
        window.location.href = "/login";
      },
    }),
    {
      name: "we-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
