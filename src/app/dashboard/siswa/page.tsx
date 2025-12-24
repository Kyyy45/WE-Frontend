"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/landing-page/header";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { IconCircleCheck, IconBook, IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/axios";

export default function SiswaDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentStatus = searchParams.get("payment");
  const { user, logout } = useAuthStore();

  // [PERBAIKAN] Menggunakan 'username' sesuai types/user.ts
  // Fallback ke email jika username entah kenapa kosong
  const displayName = user?.username || user?.email || "Siswa";
  
  // Ambil huruf pertama untuk avatar
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-32">
        <Container>
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            
            {/* 1. ALERT PEMBAYARAN SUKSES */}
            {paymentStatus === "success" && (
              <div className="w-full max-w-2xl bg-primary/10 border border-primary/20 text-foreground p-8 rounded-[2rem] animate-in fade-in zoom-in duration-500 flex flex-col items-center shadow-lg shadow-primary/5">
                <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mb-4 border border-primary/20">
                  <IconCircleCheck size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
                <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                  Terima kasih telah mendaftar. Kelas Anda kini sudah aktif dan dapat diakses melalui menu "Kelas Saya".
                </p>
                <Button 
                  size="lg"
                  className="rounded-full px-8 shadow-lg shadow-primary/20"
                  onClick={() => router.replace("/dashboard/siswa")} 
                >
                  Mulai Belajar
                </Button>
              </div>
            )}

            {/* 2. DASHBOARD AREA */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               {/* Kartu Profil */}
               <div className="md:col-span-1 p-8 border border-border rounded-[2.5rem] bg-card shadow-xl shadow-primary/5 h-fit">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                        {displayInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-lg truncate" title={displayName}>
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full w-fit mt-1">
                          {user?.role} Account
                        </p>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 mb-6">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Status</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          Aktif
                        </p>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" 
                        onClick={() => {
                          logout();
                          router.push("/login");
                        }}
                      >
                        <IconLogout size={18} className="mr-2" />
                        Keluar Akun
                      </Button>
                   </div>
               </div>

               {/* Area Konten Utama */}
               <div className="md:col-span-2 p-10 border border-border rounded-[2.5rem] bg-card/50 border-dashed min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
                   
                   <div className="relative z-10 flex flex-col items-center">
                     <div className="h-24 w-24 bg-muted/50 rounded-[2rem] flex items-center justify-center mb-6 text-muted-foreground border border-border/50 rotate-3 transition-transform hover:rotate-6 duration-500">
                        <IconBook size={48} stroke={1.5} />
                     </div>
                     <h3 className="text-2xl font-bold mb-3">Kelas Saya</h3>
                     <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">
                       Anda belum memulai pembelajaran apapun. Silakan kembali lagi nanti saat Fase 4 (User Dashboard) selesai.
                     </p>
                     <Button onClick={() => router.push("/courses")} size="lg" className="rounded-full px-8">
                       Cari Kelas Baru
                     </Button>
                   </div>
               </div>
            </div>

          </div>
        </Container>
      </main>
    </div>
  );
}