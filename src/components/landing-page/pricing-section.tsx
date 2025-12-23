import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";

export default function FeaturedCourseSection() {
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
            <div className="grid items-center gap-8 divide-y p-8 md:p-12 md:grid-cols-2 md:divide-x md:divide-border md:divide-y-0">
              <div className="pb-12 text-center md:pb-0 md:pr-12">
                <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                  Paling Populer
                </div>

                <h3 className="text-3xl font-bold text-foreground tracking-tight">
                  Intensive IELTS Preparation
                </h3>
                <p className="mt-2 text-muted-foreground text-sm md:text-base">
                  Target skor 7.5+ dengan metode pembelajaran akselerasi
                </p>

                <div className="mb-6 mt-12 inline-flex items-baseline font-bold text-primary">
                  <span className="text-4xl mr-1">Rp</span>
                  <span className="text-7xl tracking-tighter">1,5</span>
                  <span className="text-2xl ml-1 text-muted-foreground font-normal">
                    jt
                  </span>
                </div>

                <div className="flex flex-col gap-4 items-center">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Link href="#">Ambil Program Ini</Link>
                  </Button>
                </div>
              </div>

              <div className="relative pt-12 md:pt-0 md:pl-12">
                <h4 className="font-bold text-foreground mb-6">
                  Apa yang Anda dapatkan:
                </h4>
                <ul role="list" className="space-y-4">
                  {[
                    "24 Sesi intensif dengan Professional Tutor",
                    "Simulasi IELTS Mock Test setiap minggu",
                    "Feedback personal untuk Writing & Speaking",
                    "Akses materi digital & rekaman kelas selamanya",
                  ].map((item, index) => (
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
                      <span className="text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/courses"
                  className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all underline underline-offset-4 decoration-primary/30"
                >
                  Lihat semua course <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
