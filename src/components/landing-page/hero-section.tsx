/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";

export default function HeroSection() {
  const items = [
    {
      title: "World-Class Material",
      image: "/hero-section/Keyboard.png",
      className: `
        absolute left-1/2 -translate-x-1/2 top-0 
        rotate-[-4deg] z-30
        left-[42%] top-10 lg:left-[75%] lg:top-50 lg:rotate-[-7deg]
      `,
    },
    {
      title: "Strategic Learning",
      image: "/hero-section/waktu.png",
      className: `
        absolute left-1/2 -translate-x-1/2 top-4 
        rotate-[2deg] z-20
        left-[52%] top-20 lg:left-[82%] lg:top-58 lg:rotate-[6deg]
      `,
    },
    {
      title: "Premium Environment",
      image: "/hero-section/setup-meja.png",
      className: `
        absolute left-1/2 -translate-x-1/2 top-8 
        rotate-[6deg] z-10
        left-[52%] top-6 lg:left-[86%] lg:top-70 lg:rotate-[3deg]
      `,
    },
  ];

  return (
    <SectionWrapper>
      <section className="relative overflow-hidden">
        <Container
          className="
            relative
            grid grid-cols-1 gap-20
            pt-32 pb-32
            md:pt-40 md:pb-40
            lg:grid-cols-2 lg:gap-0 lg:pt-56 lg:pb-56
          "
        >
          <div className="relative z-30 w-full flex justify-center">
            <div className="max-w-2xl mx-auto text-center lg:text-left">
              <div className="mb-4 flex justify-center lg:justify-start">
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

              <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Broden Your{" "}
                <span
                  className={cn(
                    "font-serif italic font-normal",
                    "bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent"
                  )}
                >
                  Horizon
                </span>
                <div className="mt-3 flex flex-wrap justify-center lg:justify-start items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-foreground dark:bg-primary/10">
                    <Image
                      src="/logo.png"
                      alt="Worldpedia Education"
                      width={28}
                      height={28}
                    />
                  </span>

                  <Highlighter action="highlight" color="oklch(0.795 0.184 86)">
                    <span className="text-foreground font-bold">
                      Worldpedia
                    </span>
                  </Highlighter>

                  <span className="bg-linear-to-r from-foreground to-foreground/50 bg-clip-text text-transparent block w-full lg:w-auto text-center lg:text-left wrap-break-word">
                    Education
                  </span>
                </div>
              </h1>

              <p className="mt-8 max-w-xl mx-auto lg:mx-0 lg:text-xl md:text-lg text-base leading-relaxed text-muted-foreground">
                Bangun kepercayaan diri berbicara bahasa Inggris bersama tutor
                profesional dan metode pembelajaran interaktif di Worldpedia
                Education.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <Link href="/courses">Daftar Sekarang</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                  asChild
                >
                  <Link href="/kontak">Hubungi Kami</Link>
                </Button>
              </div>
            </div>
          </div>

          <DraggableCardContainer
            className="
              pointer-events-none
              relative z-50 
              h-112.5 w-full 
              mt-12 
              lg:absolute lg:inset-0 lg:h-full lg:mt-0
            "
          >
            {items.map((item) => (
              <DraggableCardBody
                key={item.title}
                className={cn(
                  "pointer-events-auto w-70 sm:w-76 rounded-3xl bg-card text-card-foreground p-4 shadow-2xl cursor-grab",
                  item.className
                )}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  draggable={false}
                  className="h-74 sm:h-80 w-full rounded-3xl object-cover"
                />
                <h3 className="mt-4 text-center text-lg text-card-foreground font-medium tracking-tight">
                  {item.title}
                </h3>
              </DraggableCardBody>
            ))}
          </DraggableCardContainer>
        </Container>
      </section>
    </SectionWrapper>
  );
}
