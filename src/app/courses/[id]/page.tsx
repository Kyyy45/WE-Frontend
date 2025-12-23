"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Layout & UI Components
import { Header } from "@/components/landing-page/header";
import FooterSection from "@/components/landing-page/footer";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

// Icons
import { IconCheck, IconChevronLeft } from "@tabler/icons-react";
import { ArrowRightIcon } from "lucide-react";

export default function CourseDetailPage() {
  // Mock Data visual
  const course = {
    title: "IELTS Intensive Prep",
    category: "SMA",
    originalPrice: "Rp 5.000.000", // Harga sebelum diskon
    totalPrice: "Rp 1.500.000", // Harga setelah diskon
    regisFee: "Rp 250.000",
    sppFee: "Rp 450.000 / Bulan",
    rating: 4.9,
    students: 120,
    duration: "3 Bulan",
    level: "Intermediate",
    description:
      "Program intensif yang dirancang khusus untuk membekali Anda dengan strategi menjawab soal IELTS secara akurat. Fokus pada 4 pilar utama: Listening, Reading, Writing, dan Speaking dengan simulasi tes mingguan.",
    features: [
      "Tutor Bersertifikasi Internasional",
      "Modul Pembelajaran Eksklusif",
      "Simulasi IELTS Real-Exam",
      "Feedback Personal tiap sesi",
      "Akses Rekaman Kelas Selamanya",
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
      <Header />

      <main className="flex-1">
        {/* --- SECTION 1: HERO DETAIL (DENGAN FRAMED LINES) --- */}
        <SectionWrapper className="relative border-b border-border/50">
          {/* Framed Layout Lines */}
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container className="pt-32 pb-16 md:pt-44 lg:pt-52">
            <Link
              href="/courses"
              className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <IconChevronLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
              Kembali ke Katalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Kolom Kiri: Teks */}
              <div className="max-w-2xl text-center lg:text-left order-2 lg:order-1">
                <div className="mb-6 flex justify-center lg:justify-start">
                  <div
                    className={cn(
                      "group inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      "border-border bg-muted text-foreground hover:bg-muted/80"
                    )}
                  >
                    <AnimatedShinyText className="inline-flex items-center gap-1">
                      <span>✨ Platform Worldpedia</span>
                      <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </AnimatedShinyText>
                  </div>
                </div>

                <h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
                  {course.title.split(" ")[0]}{" "}
                  <span className="font-serif italic font-normal bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    {course.title.split(" ").slice(1).join(" ")}
                  </span>
                </h1>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
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

              {/* Kolom Kanan: Single Thumbnail Card Image (UBAH DISINI) */}
              <div className="relative z-30 w-full aspect-video rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl group order-1 lg:order-2">
                {/* Menggunakan gambar utama sebagai thumbnail */}
                <Image
                  src="/hero-section/setup-meja.png"
                  alt="Course Thumbnail"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Glow effect di belakang */}
                <div className="absolute -z-10 -top-10 -right-10 size-64 bg-primary/10 blur-[100px] rounded-full" />
              </div>
            </div>
          </Container>
        </SectionWrapper>

        {/* --- SECTION 2: CONTENT & ENROLLMENT --- */}
        <SectionWrapper className="relative">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container className="py-20 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24 items-start">
              {/* SISI KIRI: DESKRIPSI & MANFAAT */}
              <div className="space-y-20">
                <div className="max-w-3xl space-y-16">
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-1 w-12 bg-primary rounded-full" />
                      <h2 className="text-2xl font-bold text-foreground tracking-tight">
                        Deskripsi Program
                      </h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg lg:text-xl">
                      {course.description}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-1 w-12 bg-primary rounded-full" />
                      <h2 className="text-2xl font-bold text-foreground tracking-tight">
                        Apa yang akan didapatkan?
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.features.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-5 rounded-[1.8rem] bg-card border border-border/50 hover:border-primary/30 transition-all group"
                        >
                          <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <IconCheck size={14} strokeWidth={4} />
                          </div>
                          <span className="text-sm font-semibold text-foreground/80 leading-snug">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* SISI KANAN: STICKY ENROLLMENT CARD (REDESIGNED) */}
              <aside className="lg:sticky lg:top-32 z-30">
                <div className="relative group rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl overflow-hidden">
                  <div className="relative z-10 space-y-8">
                    {/* Bagian Harga dengan Diskon (Redesign) */}
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-1 opacity-60">
                        Investasi Sekarang
                      </p>
                      <h3 className="text-5xl font-black text-foreground tracking-tighter">
                        {course.totalPrice}
                      </h3>
                    </div>

                    <div className="space-y-4 pt-2">
                      <Button className="w-full h-16 rounded-[1.2rem] text-base font-black bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 transition-all uppercase tracking-widest">
                        Daftar Program Sekarang
                      </Button>
                      {/* Tombol Chatbot AI DIHAPUS di sini */}
                    </div>

                    <div className="pt-8 border-t border-border/50 space-y-6">
                      <p className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
                        Rincian Biaya:
                      </p>
                      <div className="grid gap-5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary" />{" "}
                            Biaya Pendaftaran
                          </span>
                          <span className="text-foreground">
                            {course.regisFee}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary" />{" "}
                            Biaya SPP Bulanan
                          </span>
                          <span className="text-foreground">
                            {course.sppFee}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-center text-muted-foreground font-medium italic pt-2">
                      *Termasuk modul fisik & akses platform digital.
                    </p>
                  </div>

                  <BorderBeam
                    duration={10}
                    size={450}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    colorFrom="var(--primary)"
                    colorTo="var(--accent)"
                  />
                </div>
              </aside>
            </div>
          </Container>
        </SectionWrapper>
      </main>

      <FooterSection />
    </div>
  );
}
