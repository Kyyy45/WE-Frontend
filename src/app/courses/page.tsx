"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/landing-page/header";
import FooterSection from "@/components/landing-page/footer";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Highlighter } from "@/components/ui/highlighter";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { CourseCard } from "@/components/courses/course-card";
import { api } from "@/lib/axios";
import { Course } from "@/types/course";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { IconLayoutGrid, IconSchool, IconLoader } from "@tabler/icons-react";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS: { value: string; label: string }[] = [
  { value: "SEMUA", label: "SEMUA" },
  { value: "bk_tk", label: "BK & TK" },
  { value: "sd", label: "SD" },
  { value: "smp", label: "SMP" },
  { value: "sma", label: "SMA" },
  { value: "umum", label: "UMUM" },
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("SEMUA");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Backend Filtering Logic
        const params: Record<string, string> = {};
        if (activeFilter !== "SEMUA") {
          params.level = activeFilter;
        }

        const { data } = await api.get<ApiResponse<PaginatedResponse<Course>>>(
          "/courses",
          {
            params,
          }
        );

        if (data.data && Array.isArray(data.data.items)) {
          setCourses(data.data.items);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Gagal mengambil kursus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeFilter]);

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION  */}
        <SectionWrapper className="relative border-b border-border/50">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <section className="relative">
            <Container className="relative grid grid-cols-1 gap-12 lg:gap-20 pt-32 pb-16 md:pt-40 md:pb-24 lg:grid-cols-2 lg:pt-56 lg:pb-32 items-center">
              {/* Kolom Kiri: Teks */}
              <div className="relative z-30 w-full text-center lg:text-left">
                <div className="mb-8 flex justify-center lg:justify-start">
                  <div className="group inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors border-border bg-muted text-foreground hover:bg-muted/80">
                    <AnimatedShinyText className="inline-flex items-center gap-1">
                      <span>✨ Platform Worldpedia</span>
                      <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </AnimatedShinyText>
                  </div>
                </div>

                <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
                  Program Pilihan <br />
                  <span className="font-serif italic font-normal bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    Worldpedia Education
                  </span>
                </h1>

                <p className="mt-8 text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Tingkatkan kompetensi melalui{" "}
                  <Highlighter
                    action="underline"
                    color="var(--primary)"
                    isView={true}
                  >
                    kurikulum terakselerasi
                  </Highlighter>{" "}
                  yang dirancang untuk standar global.
                </p>
              </div>

              {/* Kolom Kanan: Bento Image Grid */}
              <div className="relative z-30 grid grid-cols-2 grid-rows-2 gap-4 h-87.5 md:h-112.5 lg:h-125 w-full min-w-0">
                <div className="col-span-1 row-span-2 relative rounded-4xl overflow-hidden border border-border/50 group shadow-2xl">
                  <Image
                    src="/hero-section/setup-meja.png"
                    alt="Learning"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-4xl overflow-hidden border border-border/50 group shadow-2xl">
                  <Image
                    src="/hero-section/Keyboard.png"
                    alt="Tools"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-4xl overflow-hidden border border-border/50 group shadow-2xl">
                  <Image
                    src="/hero-section/waktu.png"
                    alt="Strategy"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -z-10 -top-10 -right-10 size-64 bg-primary/10 blur-[100px] rounded-full" />
              </div>
            </Container>
          </section>
        </SectionWrapper>

        {/* SECTION 2: KATALOG */}
        <SectionWrapper className="relative">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container className="pb-32 md:pb-48 relative">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] items-start min-w-0">
              {/* SIDEBAR FILTER */}
              <aside className="lg:sticky lg:top-32 z-30 pt-12 lg:pr-12 lg:border-r lg:border-border/50 h-fit lg:min-h-[60vh]">
                <div className="mb-8 flex items-center gap-2">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Kategori
                  </span>
                </div>

                <nav className="flex flex-wrap lg:flex-col gap-1">
                  {FILTERS.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setActiveFilter(item.value)}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-all duration-300 text-left rounded-lg group",
                        activeFilter === item.value
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {activeFilter === item.value && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary hidden lg:block" />
                      )}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* COURSE LISTING GRID */}
              <div className="min-w-0 lg:pl-16 pt-12">
                <div className="flex items-center justify-between border-b border-border/50 pb-8 mb-12">
                  <div className="flex items-center gap-3">
                    <IconLayoutGrid size={20} className="text-primary" />
                    <h2 className="text-lg font-bold">Katalog Kursus</h2>
                    <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-muted-foreground">
                      {loading ? "..." : courses.length} Program
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <IconLoader
                      className="animate-spin text-primary mb-2"
                      size={32}
                    />
                    <p className="text-muted-foreground text-sm">
                      Memuat data kursus...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}

                {!loading && courses.length === 0 && (
                  <div className="py-24 text-center border-y border-dashed border-border/50 bg-muted/5">
                    <IconSchool
                      size={48}
                      className="mx-auto mb-4 text-muted-foreground/20"
                    />
                    <p className="text-sm text-muted-foreground">
                      Maaf, belum ada kursus untuk kategori{" "}
                      <strong>
                        {FILTERS.find((f) => f.value === activeFilter)?.label}
                      </strong>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </SectionWrapper>
      </main>

      <FooterSection />
    </div>
  );
}
