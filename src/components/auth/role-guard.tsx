"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types/user";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Cek Login
      if (!isAuthenticated || !user) {
        router.replace("/login");
        return;
      }

      // 2. Cek Role
      if (!allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/siswa");
        }
      } else {
        // 3. Lolos Guard
        setIsChecked(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
