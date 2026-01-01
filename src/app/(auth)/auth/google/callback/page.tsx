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

      const urlAccessToken = searchParams.get("accessToken");
      const urlRefreshToken = searchParams.get("refreshToken");

      // Skenario 1: Token ada di URL (Backup strategy dari backend)
      if (urlAccessToken && urlRefreshToken) {
        try {
          useAuthStore.getState().setAccessToken(urlAccessToken);

          // Set cookie manual agar middleware bisa baca (khusus kasus redirect URL)
          document.cookie = `refreshToken=${urlRefreshToken}; path=/; secure; samesite=lax; max-age=604800`;

          const { data: profileRes } = await api.get<{ data: User }>(
            "/users/me",
            {
              headers: { Authorization: `Bearer ${urlAccessToken}` },
            }
          );

          const userData = profileRes.data;
          setAuth(userData, urlAccessToken, urlRefreshToken);

          toast.success(`Selamat datang, ${userData.fullName}`);
          router.replace("/dashboard");
          return;
        } catch (err) {
          console.error("URL Token Login Error:", err);
          toast.error("Gagal memproses sesi login.");
          router.replace("/login");
          return;
        }
      }

      // Skenario 2: Token sudah di-set via Cookie oleh Backend (Recommended)
      try {
        const { data: refreshRes } = await api.post("/auth/refresh");
        const newAccessToken = refreshRes.data.accessToken;
        const newRefreshToken = refreshRes.data.refreshToken || "";

        useAuthStore.getState().setAccessToken(newAccessToken);
        const { data: profileRes } = await api.get<{ data: User }>("/users/me");

        const userData = profileRes.data;
        setAuth(userData, newAccessToken, newRefreshToken);

        toast.success("Login berhasil!");

        if (userData.role === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/siswa");
        }
      } catch (err) {
        console.error("Cookie Login Error:", err);
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
