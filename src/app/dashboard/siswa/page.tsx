"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/axios";
import { Enrollment } from "@/types/enrollment";
import { ApiResponse } from "@/types/api";
import { Payment } from "@/types/payment";
import { Loader2, BookOpen, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export default function SiswaDashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // State Data
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Enrollments (Kelas Saya)
        // Endpoint: GET /enrollments/me
        const enrollRes = await api.get<ApiResponse<Enrollment[]>>("/enrollments/me");
        const myEnrollments = enrollRes.data.data || [];
        setEnrollments(myEnrollments);
        
        // Hitung statistik kelas aktif
        const activeCount = myEnrollments.filter(e => e.status === "active").length;
        setActiveCoursesCount(activeCount);

        // 2. Fetch Payments (Tagihan) - Optional untuk statistik dashboard
        // Endpoint: GET /payments/me
        const payRes = await api.get<ApiResponse<Payment[]>>("/payments/me");
        const pendingCount = (payRes.data.data || []).filter(p => p.status === "pending").length;
        setPendingPaymentsCount(pendingCount);

      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const displayName = user?.fullName || user?.username || "Siswa";

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* 1. Header Area */}
      <div className="flex flex-col gap-1">
         <h1 className="text-2xl font-bold tracking-tight">Selamat Datang, {displayName}!</h1>
         <p className="text-muted-foreground">Lanjutkan progres belajarmu hari ini.</p>
      </div>

      {/* 2. Grid Statistik Utama */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Stat 1: Kelas Aktif */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas Aktif</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoursesCount}</div>
            <p className="text-xs text-muted-foreground">Kursus yang sedang diikuti</p>
          </CardContent>
        </Card>

        {/* Stat 2: Tagihan Pending */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tagihan Pending</CardTitle>
            <AlertCircle className={`h-4 w-4 ${pendingPaymentsCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pendingPaymentsCount > 0 ? "text-destructive" : ""}`}>
                {pendingPaymentsCount}
            </div>
            <p className="text-xs text-muted-foreground">
                {pendingPaymentsCount > 0 ? "Segera selesaikan pembayaran" : "Tidak ada tagihan"}
            </p>
          </CardContent>
        </Card>

        {/* Stat 3: Total Kelas (All Time) */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terdaftar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">Riwayat pendaftaran</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Recent Courses Grid / Content Area */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Kelas Terbaru Saya</h2>
            <Button variant="link" asChild className="px-0">
               <Link href="/dashboard/siswa/courses">Lihat Semua</Link>
            </Button>
         </div>

         {enrollments.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {enrollments.slice(0, 3).map((enrollment) => {
                  // Type Guard: Pastikan courseId populated (object) bukan string ID
                  const course = typeof enrollment.courseId === 'object' ? enrollment.courseId : null;
                  
                  if (!course) return null; // Skip jika data corrupt

                  return (
                    <Card key={enrollment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                       <div className="aspect-video relative bg-muted">
                          {course.thumbnailUrl ? (
                             <Image 
                               src={course.thumbnailUrl} 
                               alt={course.title} 
                               fill 
                               className="object-cover" 
                             />
                          ) : (
                             <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                No Image
                             </div>
                          )}
                          <div className="absolute top-2 right-2">
                             <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                                {enrollment.status}
                             </Badge>
                          </div>
                       </div>
                       <CardContent className="p-4">
                          <h3 className="font-bold text-base line-clamp-1 mb-1">{course.title}</h3>
                          <p className="text-xs text-muted-foreground mb-4 capitalize">{course.level.replace("_", " ")}</p>
                          
                          <Button className="w-full h-8 text-xs" asChild>
                             <Link href={`/dashboard/siswa/courses/${course.id}`}>
                                Lanjut Belajar
                             </Link>
                          </Button>
                       </CardContent>
                    </Card>
                  )
               })}
            </div>
         ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/20">
               <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
               <h3 className="font-semibold text-lg">Belum ada kelas aktif</h3>
               <p className="text-muted-foreground text-sm mb-6">
                  Mulai perjalanan belajarmu dengan mendaftar kelas baru.
               </p>
               <Button asChild>
                  <Link href="/courses">Cari Kelas Baru</Link>
               </Button>
            </div>
         )}
      </div>
    </div>
  );
}