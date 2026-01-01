"use client";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { formatRupiah } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Course, LandingSectionProps } from "@/types/landing";

interface PricingProps extends LandingSectionProps {
  courses?: Course[] | null;
}

export default function FeaturedCourseSection({
  courses,
  isLoading = false,
}: PricingProps) {
  const featuredCourse =
    courses?.find((c) => c.price > 0 && !c.isFree) ||
    (courses && courses.length > 0 ? courses[0] : null);
  const showSkeleton = isLoading || (!featuredCourse && courses === undefined);

  return (
    <SectionWrapper>
      <Container className="py-12 md:py-24">
        <div className="mb-12 md:mb-20 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance max-w-4xl mx-auto lg:mx-0">
            Program Belajar Unggulan Kami
          </h2>
          <p className="text-muted-foreground mt-6 text-base md:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Mulai langkah Anda dengan kursus bahasa Inggris pilihan yang
            dirancang khusus untuk mempercepat penguasaan bahasa.
          </p>
        </div>

        <div className="mt-12 md:mt-20">
          <div className="bg-card relative rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden">
            {showSkeleton ? (
              <div className="grid items-center gap-8 divide-y p-6 sm:p-8 md:p-12 md:grid-cols-2 md:divide-x md:divide-border md:divide-y-0">
                <div className="space-y-6 text-center md:text-right md:pr-12">
                  <Skeleton className="h-6 w-32 rounded-full mx-auto md:ml-auto md:mr-0" />
                  <Skeleton className="h-10 w-3/4 mx-auto md:ml-auto md:mr-0" />
                  <Skeleton className="h-20 w-1/2 mx-auto md:ml-auto md:mr-0" />
                  <Skeleton className="h-12 w-40 rounded-full mx-auto md:ml-auto md:mr-0" />
                </div>
                <div className="space-y-4 pt-12 md:pt-0 md:pl-12">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ) : featuredCourse ? (
              <div className="grid items-center gap-8 divide-y p-6 sm:p-8 md:p-12 md:grid-cols-2 md:divide-x md:divide-border md:divide-y-0">
                <div className="pb-8 sm:pb-12 text-center md:pb-0 md:pr-12">
                  <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                    {featuredCourse.level.replace("_", " ") ||
                      "Program Unggulan"}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight line-clamp-2 px-2 sm:px-0">
                    {featuredCourse.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground text-sm md:text-base line-clamp-2 px-2 sm:px-0">
                    {featuredCourse.description ||
                      "Tingkatkan kemampuan bahasa Inggris Anda."}
                  </p>

                  <div className="mb-6 mt-8 md:mt-12 inline-flex flex-wrap justify-center items-baseline font-bold text-primary">
                    {featuredCourse.isFree ? (
                      <span className="text-4xl sm:text-6xl tracking-tighter">
                        GRATIS
                      </span>
                    ) : (
                      <span className="text-4xl sm:text-5xl tracking-tighter break-all">
                        {formatRupiah(featuredCourse.price).replace(",00", "")}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 items-center">
                    <Button
                      asChild
                      size="lg"
                      className="w-full sm:w-auto rounded-full px-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Link href={`/courses/${featuredCourse.slug}`}>
                        Ambil Program Ini
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="relative pt-8 sm:pt-12 md:pt-0 md:pl-12">
                  <h4 className="font-bold text-foreground mb-6">
                    Apa yang Anda dapatkan:
                  </h4>
                  <ul role="list" className="space-y-4">
                    {(featuredCourse.benefits &&
                    featuredCourse.benefits.length > 0
                      ? featuredCourse.benefits
                      : [
                          "Materi terstruktur dan komprehensif",
                          "Akses selamanya ke materi pembelajaran",
                          "Sertifikat penyelesaian digital",
                          "Dukungan komunitas pembelajar",
                        ]
                    )
                      .slice(0, 5)
                      .map((item, index) => {
                        const text =
                          typeof item === "string" ? item : item.value;
                        return (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-foreground/80"
                          >
                            <div className="mt-1 bg-primary/20 p-1 rounded-full shrink-0">
                              <Check
                                className="size-3 text-primary"
                                strokeWidth={3}
                              />
                            </div>
                            <span className="text-sm md:text-base">{text}</span>
                          </li>
                        );
                      })}
                  </ul>

                  <Link
                    href="/courses"
                    className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all underline underline-offset-4 decoration-primary/30"
                  >
                    Lihat semua course <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <h3 className="text-xl font-bold">Program segera hadir</h3>
                <p className="text-muted-foreground">
                  Nantikan kursus terbaik dari kami.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
