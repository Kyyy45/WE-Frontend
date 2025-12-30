"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { User } from "@/types/user";
import { AxiosError } from "axios";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  // Ref untuk memastikan hanya jalan 1x (Anti-Strict Mode)
  const hasFetched = useRef(false);

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast.error("Gagal login Google: " + error);
      router.replace("/login");
      return;
    }

    const hydrateGoogleSession = async () => {
      // Cegah double-fetch di React Strict Mode
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        console.log("🔄 Menunggu browser menyimpan cookie...");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("🚀 Mengambil Access Token...");
        // 1. Ambil Access Token String via Refresh Endpoint
        // Browser otomatis mengirim cookie 'refreshToken' (HttpOnly)
        const { data: refreshRes } = await api.post<{
          data: { accessToken: string };
        }>("/auth/refresh");

        console.log("✅ Token didapat, mengambil profil...");
        const accessToken = refreshRes.data.accessToken;

        // 2. Simpan token ke Memory State (untuk interceptor)
        useAuthStore.getState().setAccessToken(accessToken);

        // 3. Ambil Data Profil User
        const { data: profileRes } = await api.get<{ data: User }>("/users/me");
        const userData = profileRes.data;
        
        // 4. Update Global State
        setAuth(userData, accessToken);

        toast.success(
          `Login Google berhasil! Selamat datang, ${userData.fullName}`
        );
        router.replace("/dashboard");
      } catch (err: unknown) {
        console.error("❌ Google Auth Handshake Failed:", err);

        // Cek apakah error dari Axios dan statusnya 401
        if (err instanceof AxiosError && err.response?.status === 401) {
          console.error(
            "⚠️ Penyebab: Cookie refreshToken tidak ditemukan atau tidak valid."
          );
          toast.error(
            "Gagal memverifikasi sesi. Pastikan browser mengizinkan cookie."
          );
        } else {
          toast.error("Gagal memverifikasi sesi Google. Silakan coba lagi.");
        }

        router.replace("/login");
      }
    };

    hydrateGoogleSession();
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Loader2 className="relative h-12 w-12 md:h-16 md:w-16 animate-spin text-primary" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
          Menghubungkan Akun Google...
        </h3>
        <p className="text-muted-foreground text-sm md:text-base animate-pulse max-w-xs mx-auto">
          Mohon tunggu sebentar, kami sedang memverifikasi keamanan sesi Anda.
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
