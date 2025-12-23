import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => 
        set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (accessToken) => 
        set({ accessToken }),

      updateUser: (updates) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () => 
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'we-auth-storage', // Nama key di LocalStorage
      // Kita persist User info agar UI tidak "flicker", 
      // tapi accessToken idealnya di memory (untuk security max).
      // Namun untuk kemudahan development awal, kita persist semua dulu.
    }
  )
);