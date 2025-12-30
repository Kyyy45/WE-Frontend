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
          // Panggil backend untuk clear httpOnly cookies
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout server error:", error);
        }

        // Hapus state client
        document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax; secure";

        // Hapus state client
        set({ user: null, accessToken: null, isAuthenticated: false });
        
        // Hapus localStorage persist
        localStorage.removeItem("we-auth-storage");

        // Redirect paksa
        window.location.href = "/login";
      },
    }),
    {
      name: "we-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
