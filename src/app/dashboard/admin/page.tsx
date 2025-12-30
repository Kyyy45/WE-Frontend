"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalPayments: number;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Kita panggil semua endpoint list dengan limit 1
        // Karena backend mengirim field 'total' di response pagination
        const [usersRes, coursesRes, enrollmentsRes, paymentsRes] =
          await Promise.all([
            api.get("/users?limit=1"),
            api.get("/courses?limit=1"),
            api.get("/enrollments?limit=1"),
            api.get("/payments?limit=1"),
          ]);

        setStats({
          totalUsers: usersRes.data.data.total || 0,
          totalCourses: coursesRes.data.data.total || 0,
          totalEnrollments: enrollmentsRes.data.data.total || 0,
          totalPayments: paymentsRes.data.data.total || 0,
        });
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
        toast.error("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas platform Worldpedia Education.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total User */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Akun terdaftar di sistem
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Kursus */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Kursus
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Kelas aktif dan tersedia
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Pendaftaran */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enrollment
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Siswa yang mendaftar kelas
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Total Transaksi */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transaksi
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              Transaksi masuk (Semua status)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder untuk widget masa depan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-border bg-card">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-50 items-center justify-center rounded-md border border-dashed text-muted-foreground">
              Chart / Grafik Aktivitas akan tampil di sini
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm border-border bg-card">
          <CardHeader>
            <CardTitle>Pendaftaran Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-50 items-center justify-center rounded-md border border-dashed text-muted-foreground">
              List User Terbaru akan tampil di sini
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
