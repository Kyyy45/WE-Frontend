"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userService } from "@/services/user.service";
import { setCookie } from "@/lib/cookies";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    const handleGoogleLogin = async () => {
      if (!accessToken) {
        toast.error("Gagal Login", { description: "Token tidak ditemukan dari Google." });
        router.push("/login");
        return;
      }

      try {
        // 1. Simpan Token
        setCookie("accessToken", accessToken);

        // 2. Fetch User Profile untuk cek Role
        // Kita beri sedikit delay agar cookie terbaca sempurna
        setTimeout(async () => {
            try {
                const userRes = await userService.getMe();
                const user = userRes.data;
        
                toast.success("Login Berhasil", { description: `Selamat datang, ${user?.fullName}` });
        
                // 3. Redirect Role-Based
                if (user?.role === "admin") {
                  router.push("/dashboard/admin");
                } else {
                  router.push("/dashboard/student");
                }
            } catch (error) {
                console.error("Fetch profile failed", error);
                toast.error("Gagal memuat profil user");
                router.push("/login");
            }
        }, 100);

      } catch (error) {
        console.error(error);
        router.push("/login?error=google_auth_failed");
      }
    };

    handleGoogleLogin();
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">Memproses Login Google...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}