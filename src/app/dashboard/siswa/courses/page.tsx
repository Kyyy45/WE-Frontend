"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Enrollment, EnrollmentStatus } from "@/types/enrollment";
import { Course } from "@/types/course";
import { ApiResponse } from "@/types/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Search,
  BookOpen,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function MyCoursesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [checkingId, setCheckingId] = useState<string | null>(null);

  // 1. Fetch Data Enrollment
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<ApiResponse<Enrollment[]>>(
          "/enrollments/me"
        );
        console.log("Enrollment Data:", data.data); // Cek console browser untuk debug
        setEnrollments(data.data || []);
      } catch (error) {
        console.error("Gagal memuat kelas:", error);
        toast.error("Gagal memuat daftar kelas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Logic Guard: Cek Akses
  const handleAccessCourse = async (courseId: string, enrollmentId: string) => {
    try {
      setCheckingId(enrollmentId);
      // Validasi ke backend
      await api.get(`/enrollments/me/${courseId}`);

      toast.success("Masuk ke mode belajar...");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error("Akses ditolak: Anda tidak terdaftar.");
      } else {
        toast.error("Gagal memvalidasi akses kelas.");
      }
    } finally {
      setCheckingId(null);
    }
  };

  // 3. Logic Filter (PERBAIKAN UTAMA DISINI)
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const courseData =
      enrollment.course ||
      (typeof enrollment.courseId === "object"
        ? (enrollment.courseId as Course)
        : null);

    if (!courseData) return false;

    // Filter Search
    const matchesSearch = courseData.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter Status
    const matchesStatus =
      statusFilter === "all" || enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kelas Saya</h1>
        <p className="text-base text-muted-foreground">
          Daftar semua program yang telah Anda daftarkan.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kelas..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-45 bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="expired">Kadaluarsa</SelectItem>
            <SelectItem value="pending">Menunggu Bayar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid Content */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEnrollments.map((enrollment) => {
            // [FIX] Ambil data course yang benar untuk ditampilkan
            const course = (enrollment.course || enrollment.courseId) as Course;
            const isProcessing = checkingId === enrollment.id;

            return (
              <Card
                key={enrollment.id}
                className="overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 border-border/60"
              >
                <div className="relative aspect-video bg-muted border-b border-border/50">
                  {course?.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground bg-secondary/30">
                      <BookOpen className="h-8 w-8 opacity-20" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <StatusBadge status={enrollment.status} />
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col gap-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {course?.level ? course.level.replace("_", " ") : "UMUM"}
                  </div>
                  <h3
                    className="font-bold text-lg leading-tight line-clamp-2"
                    title={course?.title}
                  >
                    {course?.title || "Judul Tidak Tersedia"}
                  </h3>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    variant={
                      enrollment.status === "active" ? "default" : "secondary"
                    }
                    disabled={enrollment.status !== "active" || isProcessing}
                    onClick={() =>
                      course && handleAccessCourse(course.id, enrollment.id)
                    }
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : enrollment.status === "active" ? (
                      <PlayCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2" />
                    )}

                    {isProcessing
                      ? "Memvalidasi..."
                      : enrollment.status === "active"
                      ? "Mulai Belajar"
                      : enrollment.status === "completed"
                      ? "Lihat Sertifikat"
                      : enrollment.status === "pending"
                      ? "Selesaikan Pembayaran"
                      : "Akses Ditutup"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
          <div className="bg-muted p-4 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Tidak ada kelas ditemukan</h3>
          <p className="text-muted-foreground max-w-sm mt-1 mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Coba ubah kata kunci pencarian atau filter status Anda."
              : "Anda belum mendaftar di kelas manapun."}
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Reset Filter
            </Button>
          ) : (
            <Button onClick={() => router.push("/courses")}>
              Jelajahi Katalog
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const styles = {
    active: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    expired: "bg-gray-100 text-gray-700 border-gray-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  const labels = {
    active: "Aktif",
    pending: "Menunggu",
    completed: "Selesai",
    expired: "Kadaluarsa",
    cancelled: "Dibatalkan",
  };

  return (
    <Badge
      variant="outline"
      className={`${styles[status]} border font-bold shadow-sm`}
    >
      {labels[status]}
    </Badge>
  );
}
