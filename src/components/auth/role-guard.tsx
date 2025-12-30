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
      if (!isAuthenticated || !user) {
        router.replace("/login");
      } else if (!allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/siswa");
        }
      } else {
        setIsChecked(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
