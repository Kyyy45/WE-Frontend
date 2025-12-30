"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarUpload } from "@/components/dashboard/siswa/profile/avatar-upload";
import { ProfileForm } from "@/components/dashboard/siswa/profile/profile-form";
import { SecurityForm } from "@/components/dashboard/siswa/profile/security-form";
import { Lock, ShieldAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  // LOGIC GOOGLE AUTH / PROVIDER DETECTION
  // Backend User Model memiliki field 'authProvider' ('local' | 'google')
  // Kita gunakan itu untuk deteksi.
  // Note: Pastikan src/types/user.ts memiliki definisi authProvider
  const isSocialLogin = user.authProvider === "google";

  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Profil</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan preferensi keamanan Anda.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-100">
          <TabsTrigger value="general">Informasi Umum</TabsTrigger>

          {/* Logic Tab Security: Disable jika Social Login */}
          {isSocialLogin ? (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  {/* Span wrapper agar tooltip jalan di elemen disabled */}
                  <span tabIndex={0} className="w-full">
                    <TabsTrigger
                      value="security"
                      disabled
                      className="w-full opacity-50 cursor-not-allowed data-[state=active]:bg-transparent"
                    >
                      Keamanan <Lock className="ml-2 w-3 h-3" />
                    </TabsTrigger>
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-destructive text-destructive-foreground"
                >
                  <p className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Akun Google tidak memiliki password lokal.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TabsTrigger value="security">Keamanan</TabsTrigger>
          )}
        </TabsList>

        <TabsContent
          value="general"
          className="space-y-6 mt-6 focus-visible:outline-none"
        >
          <AvatarUpload />
          <ProfileForm />
        </TabsContent>

        {!isSocialLogin && (
          <TabsContent
            value="security"
            className="mt-6 focus-visible:outline-none"
          >
            <SecurityForm />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
