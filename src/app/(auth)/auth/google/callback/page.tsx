// src/app/(auth)/auth/google/callback/page.tsx
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

      // 1. [SOLUSI UTAMA] Cek Token di URL
      const urlAccessToken = searchParams.get("accessToken");
      const urlRefreshToken = searchParams.get("refreshToken");

      if (urlAccessToken && urlRefreshToken) {
        console.log("✅ Token ditemukan di URL (Bypass Cookie)");

        try {
          // A. Simpan Access Token ke State
          useAuthStore.getState().setAccessToken(urlAccessToken);

          // B. Simpan Refresh Token ke Cookie Browser secara MANUAL
          // Agar sesi bertahan saat refresh page (karena cookie backend diblokir)
          document.cookie = `refreshToken=${urlRefreshToken}; path=/; secure; samesite=lax; max-age=604800`;

          // C. Ambil Profil User menggunakan token dari URL
          const { data: profileRes } = await api.get<{ data: User }>(
            "/users/me",
            {
              headers: { Authorization: `Bearer ${urlAccessToken}` },
            }
          );

          // D. Update State Auth Global
          setAuth(profileRes.data, urlAccessToken);

          toast.success(`Selamat datang, ${profileRes.data.fullName}`);
          router.replace("/dashboard/siswa");
          return; // Stop di sini, sukses!
        } catch (err) {
          console.error("Gagal memproses token URL:", err);
          toast.error("Gagal login dengan token URL.");
          router.replace("/login");
          return;
        }
      }

      // 2. Fallback: Coba cara lama (Cookie) jika URL kosong
      // (Hanya akan berhasil jika di Production/Same Domain)
      try {
        console.log("🔄 Mencoba ambil dari cookie (Fallback)...");
        const { data: refreshRes } = await api.post("/auth/refresh");

        useAuthStore.getState().setAccessToken(refreshRes.data.accessToken);
        const { data: profileRes } = await api.get("/users/me");

        setAuth(profileRes.data, refreshRes.data.accessToken);
        toast.success("Login berhasil!");
        router.replace("/dashboard/siswa");
      } catch (err) {
        console.error("Gagal auth cookie:", err);
        // Jangan tampilkan error ke user jika URL token juga gagal, biar redirect login saja
        router.replace("/login");
      }
    };

    handleCallback();
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Memproses login...</p>
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
