"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/axios";
import { Course, CourseFormReference } from "@/types/course";
import { ApiResponse } from "@/types/api";
import { Header } from "@/components/landing-page/header";
import FooterSection from "@/components/landing-page/footer";
import { Container } from "@/components/layout/container";
// IMPORT BARU:
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconArrowLeft,
  IconCheck,
  IconBook,
  IconSchool,
  IconClock,
  IconAlertCircle,
  IconPlayerPlay,
  IconUsers,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AxiosError } from "axios";
import { cn, formatRupiah } from "@/lib/utils";
import FAQSection from "@/components/landing-page/faqs-section";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  const { accessToken, user } = useAuthStore();

  // Fetch Course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<ApiResponse<Course>>(
          `/courses/${courseId}`
        );
        setCourse(data.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          notFound();
        } else {
          toast.error("Gagal memuat detail kursus");
        }
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  // Check Enrollment
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!accessToken || !user || !courseId) return;
      try {
        setCheckingEnrollment(true);
        await api.get(`/enrollments/me/${courseId}`);
        setIsEnrolled(true);
      } catch {
        setIsEnrolled(false);
      } finally {
        setCheckingEnrollment(false);
      }
    };
    checkEnrollmentStatus();
  }, [courseId, accessToken, user]);

  const handleActionClick = () => {
    if (!course) return;
    if (isEnrolled) {
      router.push("/dashboard/siswa");
      return;
    }
    if (!accessToken || !user) {
      toast.error("Silakan login terlebih dahulu.");
      router.push(`/login?returnUrl=/courses/${courseId}`);
      return;
    }
    if (course.registrationForm) {
      let formSlug = "";
      if (
        typeof course.registrationForm === "object" &&
        "slug" in course.registrationForm
      ) {
        formSlug = (course.registrationForm as CourseFormReference).slug;
      } else {
        formSlug = String(course.registrationForm);
      }
      router.push(`/form/${formSlug}?courseId=${course.id}`);
    } else {
      toast.error("Formulir belum diset admin.");
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!course) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-clip">
      <Header />

      <main className="flex-1">
        {/* === HERO SECTION DENGAN STROKE LINE === */}
        <SectionWrapper className="relative border-b border-border/50 bg-[#0a0a0a] text-white">
          {/* Garis Vertikal Kiri & Kanan */}
          <div className="absolute inset-y-0 left-0 w-px bg-white/10 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-white/10 hidden lg:block mr-[5%]"></div>

          <div className="relative pt-32 pb-16 overflow-hidden">
            <Container className="relative z-10">
              <Button
                variant="link"
                className="text-gray-400 hover:text-white pl-0 mb-6"
                asChild
              >
                <Link href="/courses">
                  <IconArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Katalog
                </Link>
              </Button>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge
                      variant="outline"
                      className="text-yellow-400 border-yellow-400/30 uppercase tracking-widest px-3 py-1"
                    >
                      {course.level.replace("_", " ")} Level
                    </Badge>
                    {course.isFree && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        Gratis
                      </Badge>
                    )}
                    {isEnrolled && (
                      <Badge className="bg-blue-600">Terdaftar</Badge>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                    {course.title}
                  </h1>

                  {course.targetAudience && (
                    <div className="flex items-center gap-2 text-gray-400 mb-4 text-lg">
                      <IconUsers className="w-5 h-5 text-yellow-500" />
                      <span>
                        Target:{" "}
                        <span className="text-white font-medium">
                          {course.targetAudience}
                        </span>
                      </span>
                    </div>
                  )}

                  <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                    {course.description
                      ? course.description.substring(0, 150) + "..."
                      : "Program pendidikan komprehensif untuk memaksimalkan potensi siswa melalui kurikulum terstruktur."}
                  </p>
                </div>

                {/* Hero Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 z-20">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <IconSchool size={64} />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </div>
        </SectionWrapper>

        {/* === MAIN CONTENT DENGAN STROKE LINE === */}
        <SectionWrapper className="relative">
          {/* Garis Vertikal Kiri & Kanan (Menggunakan warna border dari global.css) */}
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container className="py-16 md:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
              {/* LEFT COLUMN: Content */}
              <div className="space-y-12">
                {/* 1. Description */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-yellow-500 rounded-full" />
                    <h2 className="text-2xl font-bold text-foreground">
                      Tentang Kursus
                    </h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                    <p className="whitespace-pre-line leading-loose">
                      {course.description || "Tidak ada deskripsi detail."}
                    </p>
                  </div>
                </section>

                <Separator className="bg-border/60" />

                {/* 2. Benefits */}
                {course.benefits && course.benefits.length > 0 && (
                  <>
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-blue-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-foreground">
                          Benefit yang akan kamu dapatkan
                        </h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {course.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
                          >
                            <div className="mt-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 p-1.5 rounded-full shrink-0">
                              <IconCheck size={18} stroke={3} />
                            </div>
                            <span className="font-medium text-foreground/90">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                    <Separator className="bg-border/60" />
                  </>
                )}

                {/* 3. Syllabus */}
                {course.syllabus && course.syllabus.length > 0 && (
                  <>
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-purple-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-foreground">
                          Materi Pembelajaran
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {course.syllabus.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50"
                          >
                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1 font-medium text-foreground">
                              {item}
                            </div>
                            <IconBook className="text-muted-foreground w-5 h-5 opacity-50" />
                          </div>
                        ))}
                      </div>
                    </section>
                    <Separator className="bg-border/60" />
                  </>
                )}

                {/* 4. Tutor Profile (ASPECT RATIO 4:5 DISINI) */}
                {course.tutor && course.tutor.name && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-pink-500 rounded-full" />
                      <h2 className="text-2xl font-bold text-foreground">
                        Profil Pengajar
                      </h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 items-start bg-card p-8 rounded-3xl border border-border/60 shadow-sm">
                      {/* UBAH DISINI: w-32 h-40 (4:5), rounded-2xl */}
                      <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-border/50 shadow-md shrink-0 bg-muted">
                        {course.tutor.imageUrl ? (
                          <Image
                            src={course.tutor.imageUrl}
                            alt={course.tutor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <IconSchool size={40} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {course.tutor.name}
                          </h3>
                          <p className="text-primary font-medium">
                            {course.tutor.title}
                          </p>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {course.tutor.biography ||
                            "Pengajar profesional berpengalaman di bidangnya."}
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN: Sticky Sidebar */}
              <div className="lg:sticky lg:top-32 h-fit space-y-6">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-xl relative overflow-hidden">
                  {/* Decorative Top Border */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-yellow-400 via-orange-500 to-red-500" />

                  <div className="mb-6 mt-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Investasi Pendidikan
                    </p>

                    {/* Harga Utama */}
                    <div className="flex flex-col mb-4">
                      <span className="text-xs text-muted-foreground mb-1">
                        Uang Pangkal / Masuk
                      </span>
                      <span className="text-3xl font-black text-foreground">
                        {course.isFree ? "GRATIS" : formatRupiah(course.price)}
                      </span>
                    </div>

                    {/* SPP Bulanan */}
                    {!course.isFree &&
                      course.monthlyPrice &&
                      course.monthlyPrice > 0 && (
                        <div className="pt-4 border-t border-dashed border-border/50">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-muted-foreground">
                              SPP Bulanan
                            </span>
                            <span className="text-lg font-bold text-foreground">
                              {formatRupiah(course.monthlyPrice)}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground italic">
                            *Dibayarkan berkala
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className={cn(
                        "w-full font-bold h-12 text-md transition-all shadow-lg hover:shadow-primary/25 rounded-xl",
                        isEnrolled ? "bg-green-600 hover:bg-green-700" : ""
                      )}
                      onClick={handleActionClick}
                      disabled={checkingEnrollment}
                    >
                      {checkingEnrollment ? (
                        <Loader />
                      ) : isEnrolled ? (
                        <>
                          <IconPlayerPlay className="mr-2 h-5 w-5" /> Akses
                          Kelas
                        </>
                      ) : (
                        "Daftar Sekarang"
                      )}
                    </Button>

                    {!isEnrolled && (
                      <Button
                        variant="outline"
                        className="w-full h-12 font-semibold rounded-xl border-border/50 hover:bg-muted/50"
                      >
                        Konsultasi via WhatsApp
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 space-y-3 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconSchool size={18} className="text-primary" />
                      <span>
                        Level:{" "}
                        <span className="font-medium text-foreground capitalize">
                          {course.level.replace("_", "/")}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconClock size={18} className="text-primary" />
                      <span>Pembelajaran Offline</span>
                    </div>
                  </div>
                </div>

                {/* Admin Alert */}
                {!course.registrationForm && !isEnrolled && (
                  <Alert
                    variant="destructive"
                    className="animate-pulse bg-destructive/10 border-destructive/20 text-destructive"
                  >
                    <IconAlertCircle className="h-4 w-4" />
                    <AlertTitle>Perhatian Admin</AlertTitle>
                    <AlertDescription>
                      Formulir belum terhubung.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </Container>
        </SectionWrapper>
      </main>
      <FAQSection/>
      <FooterSection />
    </div>
  );
}

function Loader() {
  return (
    <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-5 h-5 block" />
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <SectionWrapper className="relative border-b border-border/50 bg-[#0a0a0a]">
        <div className="absolute inset-y-0 left-0 w-px bg-white/10 hidden lg:block ml-[5%]"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-white/10 hidden lg:block mr-[5%]"></div>
        <Container className="pt-32 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/3 bg-white/10" />
              <Skeleton className="h-16 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
              <Skeleton className="h-32 w-full bg-white/10" />
            </div>
            <Skeleton className="aspect-video w-full rounded-2xl bg-white/10" />
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper className="relative py-16">
        <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16">
            <div className="space-y-8">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Separator />
              <Skeleton className="h-8 w-1/3" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
              <Separator />
              {/* Skeleton Tutor 4:5 */}
              <div className="flex gap-6">
                <Skeleton className="w-32 h-40 rounded-2xl" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
            <Skeleton className="h-125 w-full rounded-3xl" />
          </div>
        </Container>
      </SectionWrapper>
    </div>
  );
}
