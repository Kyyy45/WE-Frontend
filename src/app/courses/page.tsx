"use client";

import React, { useState } from "react";
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
import {
  IconUsers,
  IconStar,
  IconSchool,
  IconLayoutGrid,
  IconArrowRight,
} from "@tabler/icons-react";
import { ArrowRightIcon } from "lucide-react";

const categories = ["SEMUA", "BK", "TK", "SD", "SMP", "SMA", "UMUM"];

const courseData = [
  {
    id: 1,
    category: "SMA",
    title: "IELTS Intensive Prep",
    price: "Rp 1.500.000",
    image: "/hero-section/waktu.png",
    students: 120,
    rating: 4.9,
  },
  {
    id: 2,
    category: "TK",
    title: "Fun English Kids",
    price: "Rp 750.000",
    image: "/courses/kids.png",
    students: 85,
    rating: 5.0,
  },
  {
    id: 3,
    category: "UMUM",
    title: "Business Conversation",
    price: "Rp 1.200.000",
    image: "/courses/business.png",
    students: 210,
    rating: 4.8,
  },
  {
    id: 4,
    category: "SMP",
    title: "English for SMP",
    price: "Rp 850.000",
    image: "/courses/smp.png",
    students: 150,
    rating: 4.7,
  },
  {
    id: 5,
    category: "SD",
    title: "Primary Grammar",
    price: "Rp 800.000",
    image: "/courses/sd.png",
    students: 95,
    rating: 4.9,
  },
  {
    id: 6,
    category: "BK",
    title: "Counseling Career",
    price: "Rp 500.000",
    image: "/courses/bk.png",
    students: 40,
    rating: 4.8,
  },
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("SEMUA");

  const filteredCourses =
    activeFilter === "SEMUA"
      ? courseData
      : courseData.filter((course) => course.category === activeFilter);

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
      <Header />

      <main className="flex-1">
        {/* --- SECTION 1: HEADER DENGAN BENTO GRID & FRAMED LINES --- */}
        <SectionWrapper className="relative border-b border-border/50">
          {/* Framed Layout: Vertical Lines */}
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <section className="relative">
            <Container
              className="
                relative
                grid grid-cols-1 gap-12 lg:gap-20
                pt-32 pb-16
                md:pt-40 md:pb-24
                lg:grid-cols-2 lg:pt-56 lg:pb-32
                items-center
              "
            >
              {/* Kolom Kiri: Teks */}
              <div className="relative z-30 w-full text-center lg:text-left">
                <div className="mb-8 flex justify-center lg:justify-start">
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

                <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
                  Program Pilihan <br />
                  <span className="font-serif italic font-normal bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    Worldpedia Education
                  </span>
                </h1>

                <p className="mt-8 text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
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
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-4xl overflow-hidden border border-border/50 group shadow-2xl">
                  <Image
                    src="/hero-section/Keyboard.png"
                    alt="Tools"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-4xl overflow-hidden border border-border/50 group shadow-2xl">
                  <Image
                    src="/hero-section/waktu.png"
                    alt="Strategy"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Glow di belakang bento mengikuti warna primary */}
                <div className="absolute -z-10 -top-10 -right-10 size-64 bg-primary/10 blur-[100px] rounded-full" />
              </div>
            </Container>
          </section>
        </SectionWrapper>

        {/* --- SECTION 2: KATALOG DENGAN SIDEBAR & PEMBATAS LINE --- */}
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
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-all duration-300 text-left rounded-lg group",
                        activeFilter === cat
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {activeFilter === cat && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary hidden lg:block" />
                      )}
                      {cat}
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
                      {filteredCourses.length} Program
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="group relative flex flex-col rounded-[2.5rem] border border-border bg-card p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-[1.8rem] bg-muted shadow-inner">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="rounded-full bg-background/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold border border-border/50 uppercase">
                            {course.category}
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex flex-col flex-1 px-3 py-6">
                        <div className="mb-4 flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <IconUsers size={14} className="text-primary" />
                            {course.students} Siswa
                          </div>
                          <div className="flex items-center gap-1">
                            <IconStar
                              size={14}
                              className="fill-yellow-500 text-yellow-500"
                            />
                            {course.rating}
                          </div>
                        </div>

                        <h3 className="mb-6 text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>

                        {/* Footer Card: Harga & Detail Sejajar */}
                        <div className="mt-auto flex items-end justify-between pt-6 border-t border-border/50">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-muted-foreground opacity-60">
                              Investasi
                            </span>
                            <span className="text-lg font-black">
                              {course.price}
                            </span>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-primary/20 hover:bg-primary hover:text-primary-foreground group transition-all px-6 h-10"
                            asChild
                          >
                            <Link href={`/courses/${course.id}`}>
                              Detail
                              <IconArrowRight
                                size={16}
                                className="ml-2 transition-transform group-hover:translate-x-1"
                              />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {/* Penyesuaian BorderBeam sesuai global.css */}
                      <BorderBeam
                        duration={10}
                        size={350}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        colorFrom="var(--primary)" // oklch(0.795 0.184 86.047)
                        colorTo="var(--accent)" // oklch(0.967 0.067 122.328)
                      />
                    </div>
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="py-24 text-center border-y border-dashed border-border/50 bg-muted/5">
                    <IconSchool
                      size={48}
                      className="mx-auto mb-4 text-muted-foreground/20"
                    />
                    <p className="text-sm text-muted-foreground">
                      Maaf, kelas belum tersedia untuk kategori ini.
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
