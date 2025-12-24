"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/axios";
import { Course } from "@/types/course";
import { formatRupiah } from "@/lib/utils";
import { Header } from "@/components/landing-page/header";
import FooterSection from "@/components/landing-page/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCheck,
  IconClock,
  IconCertificate,
  IconChartBar,
  IconArrowLeft,
  IconAlertCircle,
  IconMoodSad,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AxiosError } from "axios";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data.data);
      } catch (err: unknown) {
        console.error("Error fetching course:", err);

        if (err instanceof AxiosError) {
          const status = err.response?.status;
          if (status === 404 || status === 400 || status === 500) {
            notFound();
            return;
          }
        }

        toast.error("Gagal memuat detail kursus");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <IconMoodSad size={48} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Data Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Sepertinya kursus yang Anda cari tidak ada atau terjadi kesalahan
            saat mengambil data.
          </p>
          <Button onClick={() => router.push("/courses")}>
            Kembali ke Katalog
          </Button>
        </main>
      </div>
    );
  }

  const handleEnrollClick = () => {
    // 1. Cek Login: Jika user belum login, lempar ke halaman login
    if (!accessToken || !user) {
      toast.error("Silakan login terlebih dahulu untuk mendaftar.");
      router.push(`/login?returnUrl=/courses/${courseId}`);
      return;
    }

    // 2. Jika sudah login, lanjut cek Form
    if (
      course.registrationForm &&
      typeof course.registrationForm === "object"
    ) {
      const formSlug = course.registrationForm.slug;
      router.push(`/form/${formSlug}?courseId=${course.id}`);
    } else {
      toast.error(
        "Formulir pendaftaran belum diatur oleh admin untuk kursus ini."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        <div className="bg-muted/30 border-y border-border/50 py-12 mb-12">
          <Container>
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 pl-0 hover:pl-2 transition-all text-muted-foreground"
              asChild
            >
              <Link href="/courses">
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Katalog
              </Link>
            </Button>

            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="uppercase tracking-wider">
                  {course.level === "bk_tk" ? "BK & TK" : course.level}
                </Badge>
                {course.isFree && (
                  <Badge className="bg-green-600">Gratis</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Program pembelajaran komprehensif untuk tingkat{" "}
                {course.level === "bk_tk"
                  ? "BK & TK"
                  : course.level.toUpperCase()}{" "}
                dengan materi terstruktur.
              </p>
            </div>
          </Container>
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div className="space-y-10 min-w-0">
              <div className="lg:hidden rounded-2xl overflow-hidden border border-border shadow-sm aspect-video relative">
                {course.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              <section>
                <h3 className="text-2xl font-bold mb-4">Tentang Kursus</h3>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                  {course.description ||
                    "Belum ada deskripsi mendetail untuk kursus ini."}
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-bold mb-6">
                  Apa yang akan Anda pelajari?
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Materi terstruktur sesuai kurikulum",
                    "Akses selamanya ke materi pembelajaran",
                    "Sertifikat kelulusan (Digital)",
                    "Dukungan instruktur berpengalaman",
                    "Akses di perangkat Mobile & Desktop",
                    "Grup komunitas siswa",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 bg-primary/10 p-1 rounded-full">
                        <IconCheck className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 overflow-hidden relative">
                <div className="hidden lg:block rounded-xl overflow-hidden mb-6 aspect-video relative bg-muted border border-border/50">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                    Harga Kelas
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-foreground">
                      {course.isFree ? "GRATIS" : formatRupiah(course.price)}
                    </span>
                    {!course.isFree && (
                      <span className="text-sm text-muted-foreground mb-1 line-through opacity-50">
                        {formatRupiah(course.price * 1.5)}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full text-base font-bold h-12 shadow-lg shadow-primary/20"
                  onClick={handleEnrollClick}
                >
                  Daftar Sekarang
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Jaminan 30 hari uang kembali jika tidak puas.
                </p>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <IconChartBar className="w-4 h-4" /> Level
                    </span>
                    <span className="font-medium capitalize">
                      {course.level.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <IconClock className="w-4 h-4" /> Durasi
                    </span>
                    <span className="font-medium">Fleksibel</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <IconCertificate className="w-4 h-4" /> Sertifikat
                    </span>
                    <span className="font-medium">Ya</span>
                  </div>
                </div>
              </div>

              {!course.registrationForm && (
                <Alert variant="destructive">
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertTitle>Perhatian Admin</AlertTitle>
                  <AlertDescription>
                    Kursus ini belum terhubung dengan Form Pendaftaran. Siswa
                    tidak bisa mendaftar.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </Container>
      </main>

      <FooterSection />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full h-20 border-b" />
      <div className="py-12 bg-muted/30 border-b mb-12">
        <Container>
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-1/3" />
        </Container>
      </div>
      <Container>
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </Container>
    </div>
  );
}
