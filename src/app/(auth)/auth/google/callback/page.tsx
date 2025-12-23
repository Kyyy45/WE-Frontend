"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { setCookie } from "@/lib/cookies";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Gagal login: " + error);
      router.replace("/login");
      return;
    }

    if (accessToken) {
      const processLogin = async () => {
        try {
          // 1. Simpan Token Manual (Client-side Cookie & Store)
          setCookie("refreshToken", accessToken);
          useAuthStore.getState().setAccessToken(accessToken);

          // 2. Beri delay agar cookie tersimpan sebelum redirect
          setTimeout(async () => {
            try {
              // Fetch profile user
              const { data } = await api.get("/users/me");
              const userData = data.data;

              setAuth(userData, accessToken);
              toast.success(`Selamat datang, ${userData.fullName}`);

              // 3. Hard navigation ke dashboard agar middleware membaca cookie
              window.location.href = "/dashboard";
            } catch (fetchErr) {
              console.error("Fetch profile error", fetchErr);
              // Tetap redirect jika token valid meski profil gagal load
              window.location.href = "/dashboard";
            }
          }, 100);
        } catch {
          // Error handling umum
          router.replace("/login");
        }
      };
      processLogin();
    } else {
      router.replace("/login");
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-muted/30">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">
        Menghubungkan akun Google...
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
