"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/landing-page/header"; // Opsional: Biar tidak blank putih banget

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Cek Auth
    const checkAuthAndRedirect = () => {
      // Debugging: Cek di Console Browser (F12) untuk lihat status
      console.log("Dashboard Check -> Auth:", isAuthenticated, "Role:", user?.role);

      if (!isAuthenticated || !user) {
        // Jika tidak login, tendang ke login page
        router.replace("/login");
        return;
      }

      // 2. Siapkan Query Params (misal ?payment=success)
      const queryString = searchParams.toString();
      const query = queryString ? `?${queryString}` : "";

      // 3. Arahkan sesuai Role
      if (user.role === "admin") {
        router.replace(`/dashboard/admin${query}`);
      } else {
        // Default ke siswa
        router.replace(`/dashboard/siswa${query}`);
      }
    };

    // Beri sedikit delay agar hydration store selesai (Next.js Hydration fix)
    const timeout = setTimeout(() => {
      checkAuthAndRedirect();
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, user, router, searchParams]);

  // Tampilan Loading Spinner
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header /> {/* Header ditampilkan agar user tidak bingung */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm animate-pulse">
          Sedang memuat data akun...
        </p>
      </div>
    </div>
  );
}