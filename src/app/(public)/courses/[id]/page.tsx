"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link"; // Tambah ini
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle, Lock, BookOpen, Clock, BarChart, ArrowLeft } from "lucide-react"; // Tambah ArrowLeft
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { courseService } from "@/services/course.service";
import { enrollmentService } from "@/services/enrollment.service";
import { paymentService } from "@/services/payment.service";
import { userService } from "@/services/user.service";

import { ApiError } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { Course } from "@/types/course";
import { Enrollment } from "@/types/enrollment";
import { Payment } from "@/types/payment";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const formatLevel = (level: string) => {
  const map: Record<string, string> = {
    bk_paud: "PAUD / TK",
    sd: "SD",
    smp: "SMP",
    sma: "SMA",
    umum: "Umum",
  };
  return map[level] || level;
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = params.id as string;

  const { data: userProfile } = useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getMe(),
    retry: false,
  });
  const isLoggedIn = !!userProfile;

  const { data: courseResponse, isLoading: isLoadingCourse } = useQuery<ApiResponse<Course>>({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseById(courseId),
  });
  const course = courseResponse?.data;

  const { data: enrollmentResponse, isLoading: isLoadingEnrollment } = useQuery<ApiResponse<Enrollment>>({
    queryKey: ["enrollment", courseId],
    queryFn: () => enrollmentService.getMyEnrollmentForCourse(courseId),
    enabled: isLoggedIn && !!courseId,
    retry: false,
  });
  const enrollment = enrollmentResponse?.data;

  const { mutate: enrollUser, isPending: isEnrolling } = useMutation({
    mutationFn: () => enrollmentService.enrollUser({ courseId }),
    onSuccess: () => {
      toast.success("Berhasil mendaftar kursus!");
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      router.push("/dashboard/student/enrollments"); 
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal mendaftar kursus.");
    },
  });

  const { mutate: buyCourse, isPending: isBuying } = useMutation({
    mutationFn: () => paymentService.checkout({ 
        courseId, 
        paymentMethod: "qris" 
    }),
    onSuccess: (response) => {
      const paymentResponse = response as unknown as ApiResponse<Payment>;
      const snapUrl = paymentResponse.data?.snapRedirectUrl;
      
      if (snapUrl) {
        window.location.href = snapUrl;
      } else {
        toast.error("Gagal mendapatkan link pembayaran.");
      }
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal memproses pembayaran.");
    },
  });

  const handleMainAction = () => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu untuk mendaftar.");
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }

    if (course?.isFree) {
      enrollUser();
    } else {
      buyCourse();
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">Kursus tidak ditemukan</h2>
        <Button className="mt-4" onClick={() => router.push("/courses")}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  const isEnrolled = enrollment && (enrollment.status === 'active' || enrollment.status === 'completed');

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      
      {/* Navbar / Back Button Area */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
            <Link href="/courses" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
            </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-background border-y">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Kiri: Info Utama */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {formatLevel(course.level)}
                </Badge>
                {course.isFree ? (
                  <Badge className="bg-green-600 hover:bg-green-700 px-3 py-1">Gratis</Badge>
                ) : (
                  <Badge variant="outline" className="px-3 py-1 border-primary text-primary">
                    Premium
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold font-jakarta leading-tight">
                {course.title}
              </h1>
              
              {/* Deskripsi Singkat di Header (opsional, bisa diambil dari paragraf pertama desc) */}
              <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                {course.description || "Pelajari materi ini untuk meningkatkan keahlian Anda."}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-4 border-t w-full">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Akses Selamanya</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Belajar Mandiri</span>
                </div>
              </div>
            </div>

            {/* Kanan: Card Aksi (Sticky) */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 -mt-6 lg:-mt-20 z-10">
              <Card className="overflow-hidden shadow-xl border-muted ring-1 ring-black/5">
                {/* Thumbnail Image */}
                <div className="aspect-video bg-muted relative">
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <BookOpen className="h-12 w-12 opacity-50" />
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-3xl font-bold text-primary">
                    {course.isFree ? "Gratis" : formatRupiah(course.price)}
                  </CardTitle>
                  <CardDescription>
                    {course.isFree 
                      ? "Akses penuh ke seluruh materi." 
                      : "Investasi sekali bayar untuk akses selamanya."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {isEnrolled ? (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2 text-sm font-medium border border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      Anda sudah terdaftar.
                    </div>
                  ) : (
                    <ul className="text-sm space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                            <span>Akses materi kapan saja</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                            <span>Materi terstruktur rapi</span>
                        </li>
                    </ul>
                  )}
                </CardContent>

                <CardFooter className="pt-2">
                  {isEnrolled ? (
                    <Button className="w-full text-base py-6 shadow-md" asChild>
                        <a href="/dashboard/student/enrollments">Buka Kelas Saya</a>
                    </Button>
                  ) : (
                    <Button 
                        className="w-full text-base py-6 font-bold shadow-md" 
                        onClick={handleMainAction}
                        disabled={isEnrolling || isBuying || isLoadingEnrollment}
                    >
                        {isEnrolling || isBuying ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : !isLoggedIn ? (
                            <>
                                <Lock className="mr-2 h-4 w-4" /> Masuk untuk Daftar
                            </>
                        ) : course.isFree ? (
                            "Daftar Sekarang"
                        ) : (
                            "Beli Sekarang"
                        )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

          </div>
        </div>
      </div>

      {/* Detail Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
                
                {/* Deskripsi Lengkap */}
                <section className="bg-background p-6 rounded-xl border shadow-sm">
                    <h2 className="text-2xl font-bold font-jakarta mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Tentang Kursus
                    </h2>
                    {/* SOLUSI POIN 2: whitespace-pre-line */}
                    <div className="prose max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                        {course.description || "Belum ada deskripsi detail."}
                    </div>
                </section>

                <section className="bg-background p-6 rounded-xl border shadow-sm">
                    <h2 className="text-2xl font-bold font-jakarta mb-4 flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        Materi Pembelajaran
                    </h2>
                    <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                        <p>Daftar kurikulum materi akan muncul di sini.</p>
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
}