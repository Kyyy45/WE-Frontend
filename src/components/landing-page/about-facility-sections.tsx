"use client";

import { cn } from "@/lib/utils";
import {
  IconSmartHome,
  IconBooks,
  IconDeviceLaptop,
  IconUsers,
  IconSchool,
  IconShieldCheck,
  IconHeart,
  IconBolt,
  IconTrophy,
  IconStar,
} from "@tabler/icons-react";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { BorderBeam } from "@/components/ui/border-beam";
import { Highlighter } from "@/components/ui/highlighter";
import Image from "next/image";

const ImageHeader = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={cn(
      "relative w-full rounded-xl overflow-hidden bg-muted/50 group-hover:shadow-xl transition-all duration-500",
      className
    )}
  >
    <Image
      src={src}
      alt="Fasilitas Worldpedia"
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);

export default function AboutFacilityBento() {
  return (
    <SectionWrapper className="bg-background">
      <Container className="py-12 md:py-24">
        <div className="mb-12 md:mb-20 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Membangun Potensi{" "}
            <span
              className={cn(
                "font-serif italic font-normal",
                "bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              )}
            >
              Tanpa Batas
            </span>
          </h2>
          <p className="text-muted-foreground mt-6 text-base md:text-lg max-w-2xl leading-relaxed">
            Wujudkan penguasaan bahasa Inggris bersama bimbingan profesional dan
            lingkungan belajar yang dirancang khusus untuk menyambut masa depan
            global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-min">
          {items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "relative group rounded-3xl border border-border bg-card text-card-foreground flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5",
                i === 0
                  ? "md:col-span-2 lg:col-span-3 lg:row-span-2"
                  : i === 1 || i === 2
                  ? "md:col-span-1 lg:col-span-3"
                  : "md:col-span-1 lg:col-span-2"
              )}
            >
              <div className="p-6 md:p-8 flex flex-col flex-1 z-10">
                {item.header && (
                  <div className="mb-6 w-full">{item.header}</div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  {item.icon}
                  <h3 className="font-bold text-xl md:text-2xl text-foreground tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {i === 0 && (
                  <div className="mb-6">
                    <ImageHeader
                      src="/facility/about-we.jpg"
                      className="aspect-3/2 md:aspect-square"
                    />
                  </div>
                )}

                <div className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item.description}
                </div>

                {i === 0 && (
                  <div className="mt-auto pt-6 border-t border-border/50">
                    <p className="text-[10px] font-bold text-foreground mb-4 uppercase tracking-[0.2em] opacity-60">
                      Nilai Utama
                    </p>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      {[
                        {
                          label: "Professional",
                          icon: <IconTrophy size={14} />,
                        },
                        {
                          label: "Pembimbing Unggul",
                          icon: <IconStar size={14} />,
                        },
                        { label: "Tim Dinamis", icon: <IconBolt size={14} /> },
                        {
                          label: "Integritas",
                          icon: <IconShieldCheck size={14} />,
                        },
                        {
                          label: "Saling Menghargai",
                          icon: <IconHeart size={14} />,
                        },
                      ].map((val) => (
                        <div
                          key={val.label}
                          className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground"
                        >
                          <div className="flex size-5 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            {val.icon}
                          </div>
                          {val.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <BorderBeam
                duration={10}
                size={350}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                colorFrom="var(--primary)"
                colorTo="var(--accent)"
              />
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

const items = [
  {
    title: "Tentang Worldpedia",
    description: (
      <p>
        Worldpedia Education adalah kursus bahasa Inggris untuk siswa/i mulai
        dari tingkat taman kanak-kanak hingga remaja dan dewasa. Kami melayani
        siswa/i dengan{" "}
        <Highlighter action="underline" color="var(--primary)" isView={true}>
          kemampuan terbaik
        </Highlighter>{" "}
        untuk tidak hanya membuat mereka tumbuh, tetapi juga mengembangkan
        kemampuan mereka untuk siap menyambut masa depan.
      </p>
    ),
    icon: (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-foreground dark:bg-primary/10">
        <Image
          src="/logo.png"
          alt="Worldpedia Education"
          width={28}
          height={28}
        />
      </span>
    ),
  },
  {
    title: "Ruang Kelas Ber-AC",
    description:
      "Kenyamanan maksimal dengan suhu yang terjaga, memastikan fokus belajar bahasa Inggris tetap optimal selama sesi berlangsung.",
    header: <ImageHeader src="/facility/AC.png" className="aspect-2/1" />,
    icon: <IconSmartHome className="h-6 w-6 text-primary" />,
  },
  {
    title: "Fasilitas Terstandarisasi",
    description:
      "Meja dan kursi ergonomis yang mendukung postur tubuh dan kenyamanan belajar siswa dalam durasi lama.",
    header: (
      <ImageHeader src="/facility/meja-kursi.png" className="aspect-2/1" />
    ),
    icon: <IconBooks className="h-6 w-6 text-primary" />,
  },
  {
    title: "Professional Teachers",
    description:
      "Dibimbing oleh pengajar ahli dengan rekam jejak akademik luar biasa dan kemampuan pedagogi internasional.",
    header: (
      <ImageHeader
        src="/facility/guru-berkualitas.png"
        className="aspect-2/1"
      />
    ),
    icon: <IconUsers className="h-6 w-6 text-primary" />,
  },
  {
    title: "Metode Pembelajaran UK",
    description:
      "Kurikulum yang mengasah kemampuan berpikir kritis, analisis mendalam, dan pemecahan masalah.",
    header: (
      <ImageHeader
        src="/facility/metode-pembelajaran-UK.png"
        className="aspect-2/1"
      />
    ),
    icon: <IconSchool className="h-6 w-6 text-primary" />,
  },
  {
    title: "Sistem Pembelajaran US",
    description:
      "Penerapan standar internasional untuk mempersiapkan siswa bersaing di kancah dunia.",
    header: (
      <ImageHeader
        src="/facility/sistem-pembelajaran-US.png"
        className="aspect-2/1"
      />
    ),
    icon: <IconDeviceLaptop className="h-6 w-6 text-primary" />,
  },
];
