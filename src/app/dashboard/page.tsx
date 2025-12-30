"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

function DashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      // 1. Jika belum login -> Login
      if (!isAuthenticated || !user) {
        router.replace("/login");
        return;
      }

      // 2. Pertahankan query params (jika ada)
      const queryString = searchParams.toString();
      const query = queryString ? `?${queryString}` : "";

      // 3. Arahkan ke folder dashboard yang benar
      if (user.role === "admin") {
        router.replace(`/dashboard/admin${query}`);
      } else {
        router.replace(`/dashboard/siswa${query}`);
      }
    };

    // Timeout agar tidak bentrok dengan proses setAuth
    const timeout = setTimeout(() => {
      checkAuthAndRedirect();
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, user, router, searchParams]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6 min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Loader2 className="relative h-12 w-12 md:h-16 md:w-16 animate-spin text-primary" />
      </div>
      <p className="text-muted-foreground text-sm md:text-base font-medium animate-pulse">
        Memuat dashboard...
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background items-center justify-center">
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        }
      >
        <DashboardRedirect />
      </Suspense>
    </div>
  );
}
