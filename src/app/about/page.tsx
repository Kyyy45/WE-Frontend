"use client";

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
  IconTrophy,
  IconStar,
  IconBolt,
  IconShieldCheck,
  IconHeart,
  // IconArrowRight dihapus karena tidak digunakan (Error No. 3)
  IconTargetArrow,
  IconCertificate,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandTiktok,
} from "@tabler/icons-react";
import { ArrowRightIcon } from "lucide-react";

export default function AboutPage() {
  const coreValues = [
    {
      label: "Saling Menghargai",
      icon: <IconHeart size={24} />,
      desc: "Usaha untuk menjadi lebih baik.",
    },
    {
      label: "Professional",
      icon: <IconTrophy size={24} />,
      desc: "Keutamaan kami untuk keberhasilan yang baik.",
    },
    {
      label: "Pembimbing Unggul",
      icon: <IconStar size={24} />,
      desc: "Membimbing siswa/siswi kami dan melayani konsumen lebih baik.",
    },
    {
      label: "Tim Worldpedia",
      icon: <IconBolt size={24} />,
      desc: "Dinamis dan dapat diandalkan sehingga memenuhi kebutuhan konsumen.",
    },
    {
      label: "Integritas",
      icon: <IconShieldCheck size={24} />,
      desc: "Norma yang kami junjung tinggi di Worldpedia, sehingga kami dapat mempertanggung jawabkan perbuatan dan perkataan sebagai bentuk.",
    },
  ];

  const teachers = [
    {
      name: "Dessy Oktavia, S.Pd.",
      role: "Professional Tutor",
      LatarBelakang:
        "Mrs. Dessy dikenal ceria, kreatif, penyayang dan selalu membuat suasana kelas menyenangkan.",
      FunFact:
        "Funt Fact: Beliau suka bernyanyi dan bermain game edukasi bareng murid-murid dikelas.",
      Awardee: "Mrs. Dessy juga merupakan awardee dari program-program ini:",
      Proggram1: "1. CCI Schoolarship Program Awardee 2021-2022.",
      Proggram2:
        "2. Special Education Paraeducator - Norhtampton County Area Community College 2022.",
      Proggram3: "3. Letterland Certified Teacher.",
      image: "/profil-guru/DessyOktavia.jpg",
    },
    {
      name: "Anna Enriyani",
      role: "Professional Tutor",
      LatarBelakang:
        "Mrs. Anna Selalu penuh semangat dan sabar dalam membimbing anak-anak di kelas English.",
      FunFact:
        "Fun Fact: Beliau suka games seru tentang bahasa Inggris di dalam kelas, bikin anak-anak betah belajar.",
      Awardee: "Mrs. Dessy juga sudah mendapatkan sertifikat di bidang ini:",
      Proggram1:
        "1. Curriculum Based Professional Development: Linking Your Expertise and Professionalism.",
      Proggram2: "2. Letterland Certified Teacher.",
      image: "/profil-guru/AnnaEnriyani.jpg",
    },
    {
      name: "Shabrina Felia, S.M",
      role: "Professional Tutor",
      LatarBelakang:
        "Miss. Felia dikenal kreatif dan penuh ide-ide seru saat mengenalkan karakter Letterland ke anak-anak.",
      FunFact:
        "Fun Fact: Beliau suka mengubah pelajaran jadi permainan, jadi belajar huruf di kelas Letterland makin gampang diingat.",
      Awardee: "Miss. Felia juga merupakan awardee dari program-program ini:",
      Proggram1: "1. English Access Microschoolarship Program 2016-2017",
      Proggram2: "2. Letterland Certified Teacher.",
      image: "/profil-guru/ShabrinaFelia.jpg",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
      <Header />

      <main className="flex-1">
        {/* --- SECTION 1: HERO --- */}
        <SectionWrapper className="relative border-b border-border/50">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container className="pt-32 pb-24 md:pt-44 lg:pt-56">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="group inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5 text-base font-medium text-foreground transition-colors hover:bg-muted/80">
                  <AnimatedShinyText className="inline-flex items-center gap-1">
                    <span>📖 Mengenal Worldpedia</span>
                    <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </AnimatedShinyText>
                </div>
              </div>
              <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
                Membangun Potensi <br />
                <span className="font-serif italic font-normal bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                  Tanpa Batas
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Worldpedia Education hadir sebagai jembatan bagi generasi muda
                untuk menguasai bahasa internasional melalui{" "}
                <Highlighter
                  action="underline"
                  color="var(--primary)"
                  isView={true}
                >
                  pendekatan holistik
                </Highlighter>{" "}
                dan adaptif yang dirancang untuk standar global.
              </p>
            </div>
          </Container>
        </SectionWrapper>

        {/* --- SECTION 2: INTRO & VISI MISI --- */}
        <SectionWrapper className="relative border-b border-border/50 py-24 md:py-32">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                  <IconCertificate size={16} /> Worldpedia Education
                </div>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
                  Platform Pembelajaran Terpercaya untuk{" "}
                  <span className="text-primary italic font-serif font-normal">
                    Masa Depan Global
                  </span>
                  .
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Kami berdedikasi untuk membantu Anda menguasai bahasa Inggris
                  dan menjadi digital talent terbaik dengan standar global.
                </p>
                <div className="relative aspect-square rounded-4xl overflow-hidden border border-border shadow-2xl group">
                  <Image
                    src="/facility/about-we.jpg"
                    alt="Center"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-12 lg:pt-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <IconTargetArrow size={24} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      Visi & Misi
                    </h2>
                  </div>
                  {/* Karakter kutipan " di-escape (Error No. 1 & 2) */}
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed italic">
                    <Highlighter
                      action="underline"
                      color="var(--primary)"
                      isView={true}
                    >
                      Visi Worldpedia Education
                    </Highlighter>{" "}
                    Menjadi contoh dan pilihan yang menginspirasi sebagai pusat
                    pembelajaran bahasa.
                    <br />
                    <Highlighter
                      action="underline"
                      color="var(--primary)"
                      isView={true}
                    >
                      Misi Worldpedia Education
                    </Highlighter>{" "}
                    Membantu meningkatkan kemampuan berbahasa dan kemampuan
                    pengetahuan umum untuk berkontribusi di masyarakat dan
                    peningkatan.
                  </p>
                </div>

                <div className="pt-10 border-t border-border/50">
                  <div className="space-y-4">
                    <p className="text-base font-black text-primary uppercase tracking-[0.2em]">
                      Tujuan Utama
                    </p>
                    <p className="text-base font-medium text-foreground/80 leading-relaxed">
                      Meningkatkan kemampuan berbahasa siswa/siswi, WE juga
                      dapat membantu meningkatkan performa akademik siswa/siswi
                      dengan program bimbingan belajar yang mana dapat membantu
                      siswa/siswi untuk bersaing di jenjang yang lebih tinggi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </SectionWrapper>

        {/* --- SECTION 3: NILAI UTAMA --- */}
        <SectionWrapper className="relative py-24 md:py-32 border-b border-border/50">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container>
            <div className="text-center mb-16 space-y-4">
              <p className="text-primary font-black uppercase tracking-[0.3em] text-base">
                Filosofi Kerja
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Nilai-Nilai{" "}
                <span className="font-serif italic font-normal text-primary">
                  Utama
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {coreValues.map((value, i) => (
                <div
                  key={i}
                  className="group relative p-6 rounded-4xl border border-border bg-card/50 hover:bg-card transition-all duration-500 text-center flex flex-col items-center gap-4"
                >
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-base tracking-tight text-foreground">
                    {value.label}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                  <BorderBeam
                    duration={10}
                    size={150}
                    className="opacity-0 group-hover:opacity-100"
                    colorFrom="var(--primary)"
                    colorTo="var(--accent)"
                  />
                </div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* --- SECTION 4: PROFIL MENTOR --- */}
        <SectionWrapper className="relative py-32 md:py-48 border-b border-border/50">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container>
            <div className="text-center lg:text-left mb-24 space-y-4">
              <p className="text-primary font-black uppercase tracking-[0.3em] text-base">
                Tim Kami
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Kenali{" "}
                <span className="font-serif italic font-normal text-primary">
                  Mentor Anda
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl text-base">
                Belajar langsung dari para ahli yang berdedikasi tinggi untuk
                kesuksesan akademik Anda.
              </p>
            </div>

            <div className="space-y-32">
              {teachers.map((teacher, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col lg:flex-row items-center gap-12 lg:gap-24",
                    i % 2 !== 0 && "lg:flex-row-reverse"
                  )}
                >
                  {/* max-w-[400px] diubah ke max-w-100 (Saran Tailwind) */}
                  <div className="w-full lg:w-1/2 max-w-100 shrink-0">
                    <div className="relative aspect-4/5 rounded-4xl overflow-hidden border border-border shadow-2xl group bg-muted">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div>
                      <p className="text-primary font-bold text-base uppercase tracking-widest mb-1">
                        {teacher.role}
                      </p>
                      <h3 className="text-2xl md:text-4xl font-bold text-foreground">
                        {teacher.name}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {teacher.LatarBelakang}
                      <br />
                      {teacher.FunFact}
                      <br />
                      {teacher.Awardee}
                      <br />
                      {teacher.Proggram1}
                      <br />
                      {teacher.Proggram2}
                      <br />
                      {teacher.Proggram3}
                      <br />
                    </p>
                    <div className="flex justify-center lg:justify-start gap-5 pt-4 text-muted-foreground/60">
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        <IconBrandLinkedin size={24} />
                      </Link>
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        <IconBrandInstagram size={24} />
                      </Link>
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        <IconBrandTiktok size={24} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* --- SECTION 5: CTA BANNER --- */}
        <SectionWrapper className="relative py-32 md:py-48">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card border border-border p-10 md:p-16 rounded-4xl shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-lg text-center md:text-left space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Siap memulai perjalanan{" "}
                  <span className="text-primary italic font-serif font-normal">
                    global
                  </span>{" "}
                  Anda?
                </h2>
                <p className="text-muted-foreground text-base">
                  Hubungi konsultan kami untuk menemukan jenjang yang tepat bagi
                  masa depan Anda.
                </p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button className="h-14 px-10 rounded-2xl font-black bg-primary text-primary-foreground uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
              <div className="absolute -right-20 -bottom-20 size-96 bg-primary/10 blur-[120px] rounded-full" />
            </div>
          </Container>
        </SectionWrapper>
      </main>

      <FooterSection />
    </div>
  );
}
