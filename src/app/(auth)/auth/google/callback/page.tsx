"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const handleCallback = async () => {
      const error = searchParams.get("error");
      if (error) {
        toast.error("Gagal login Google: " + error);
        router.replace("/login");
        return;
      }

      // 1. AMBIL TOKEN DARI URL
      const urlAccessToken = searchParams.get("accessToken");
      const urlRefreshToken = searchParams.get("refreshToken");

      if (urlAccessToken && urlRefreshToken) {
        try {
          // A. Simpan Access Token ke State sementara untuk fetch profile
          useAuthStore.getState().setAccessToken(urlAccessToken);

          // B. Simpan Refresh Token ke Cookie Browser (Manual Backup)
          document.cookie = `refreshToken=${urlRefreshToken}; path=/; secure; samesite=lax; max-age=604800`;

          // C. Ambil Data User & Cek Role
          const { data: profileRes } = await api.get<{ data: User }>(
            "/users/me",
            {
              headers: { Authorization: `Bearer ${urlAccessToken}` },
            }
          );

          const userData = profileRes.data;

          // D. Simpan ke Global State
          setAuth(userData, urlAccessToken, urlRefreshToken);
          toast.success(`Selamat datang, ${userData.fullName}`);

          // Redirect Berdasarkan Role
          if (userData.role === "admin") {
            router.replace("/dashboard/admin");
          } else {
            router.replace("/dashboard/siswa");
          }
          
          return;
        } catch (err) {
          console.error("Gagal login dengan token URL:", err);
          toast.error("Gagal memproses sesi login.");
          router.replace("/login");
          return;
        }
      }

      // 2. Fallback (Jika token tidak ada di URL, coba refresh token via cookie)
      try {
        const { data: refreshRes } = await api.post("/auth/refresh");
        const newAccessToken = refreshRes.data.accessToken;
        
        useAuthStore.getState().setAccessToken(newAccessToken);
        const { data: profileRes } = await api.get<{ data: User }>("/users/me");
        const userData = profileRes.data;

        // Ambil refresh token baru atau gunakan string kosong jika tidak di-rotate
        const newRefreshToken = refreshRes.data.refreshToken || "";

        setAuth(userData, newAccessToken, newRefreshToken);
        toast.success("Login berhasil!");

        // Redirect Berdasarkan Role (Fallback)
        if (userData.role === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/siswa");
        }
      } catch (err) {
        console.error("Gagal auth fallback:", err);
        router.replace("/login");
      }
    };

    handleCallback();
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Memproses login Google...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen bg-background" />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}