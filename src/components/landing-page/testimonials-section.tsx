"use client";

import { motion, Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonialsData: Testimonial[] = [
  {
    name: "Jonathan Yombo",
    role: "Software Engineer",
    image: "",
    quote:
      "Tailus is really extraordinary and very practical, no need to break your head. A real gold mine.",
  },
  {
    name: "Yves Kalume",
    role: "GDE - Android",
    image: "",
    quote:
      "With no experience in webdesign I just redesigned my entire website in a few minutes with tailwindcss thanks to Tailus.",
  },
  {
    name: "Yucel Faruksahan",
    role: "Tailkits Creator",
    image: "",
    quote:
      "Great work on tailfolio template. This is one of the best personal website that I have seen so far :)",
  },
  {
    name: "Anonymous author",
    role: "Doing something",
    image: "",
    quote:
      "I am really new to Tailwind and I want to give a go to make some page on my own. I searched a lot of hero pages and blocks online.",
  },
  {
    name: "Shekinah Tshiokufila",
    role: "Senior Software Engineer",
    image: "",
    quote:
      "Tailus is redefining the standard of web design, with ini blocks it provides an easy and efficient way for those who love beauty.",
  },
  {
    name: "Oketa Fred",
    role: "Fullstack Developer",
    image: "",
    quote:
      "I absolutely love Tailus! The component blocks are beautifully designed and easy to use.",
  },
  {
    name: "Zeki",
    role: "Founder of ChatExtend",
    image: "",
    quote:
      "Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility.",
  },
  {
    name: "Joseph Kitheka",
    role: "Fullstack Developer",
    image: "",
    quote:
      "Tailus has transformed the way I develop web applications. Their extensive collection of UI components has significantly accelerated my workflow.",
  },
  {
    name: "Khatab Wedaa",
    role: "MerakiUI Creator",
    image: "",
    quote:
      "Tailus is an elegant, clean, and responsive tailwind css components it's very helpful to start fast with your project.",
  },
  {
    name: "Rodrigo Aguilar",
    role: "TailwindAwesome Creator",
    image: "",
    quote:
      "I love Tailus ❤️. The component blocks are well-structured, simple to use, and beautifully designed.",
  },
  {
    name: "Eric Ampire",
    role: "Mobile Engineer",
    image: "",
    quote:
      "Tailus templates are the perfect solution for anyone who wants to create a beautiful website without any experience.",
  },
  {
    name: "Roland Tubonge",
    role: "Software Engineer",
    image: "",
    quote:
      "Tailus is so well designed that even with a very poor knowledge of web design you can do miracles.",
  },
];

const testimonials = testimonialsData.map((item) => ({
  ...item,
  image: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    item.name
  )}`,
}));

const scrollUpVariants: Variants = {
  animate: {
    y: ["0%", "-50%"],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 40,
        ease: "linear",
      },
    },
  },
};

const scrollDownVariants: Variants = {
  animate: {
    y: ["-50%", "0%"],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 40,
        ease: "linear",
      },
    },
  },
};

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export default function WallOfLoveSection() {
  const testimonialChunks = chunkArray(
    testimonials,
    Math.ceil(testimonials.length / 3)
  );

  return (
    <SectionWrapper className="bg-background">
      <Container className="py-12 md:py-24">
        {/* Header Section */}
        <div className="mb-12 md:mb-20 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance max-w-4xl mx-auto lg:mx-0">
            Kisah Sukses Siswa Kami
          </h2>
          <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Bergabunglah dengan ratusan pembelajar yang telah berhasil meraih
            skor impian dan membuka peluang global bersama bimbingan profesional
            Worldpedia.
          </p>
        </div>

        {/* Grid Eskalator */}
        <div className="relative mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-h-175 overflow-hidden">
          {testimonialChunks.map((chunk, chunkIndex) => {
            const isEven = chunkIndex % 2 === 0;
            const doubledChunk = [...chunk, ...chunk];

            return (
              <div key={chunkIndex} className="relative h-full">
                <motion.div
                  variants={isEven ? scrollUpVariants : scrollDownVariants}
                  animate="animate"
                  className="flex flex-col gap-4 md:gap-6"
                >
                  {doubledChunk.map((item, index) => (
                    <Card
                      key={`${chunkIndex}-${index}`}
                      className="border border-border bg-card text-card-foreground shadow-sm shrink-0 rounded-3xl"
                    >
                      <CardContent className="grid grid-cols-[auto_1fr] gap-4 pt-6">
                        <Avatar className="size-9 border border-border bg-muted">
                          <AvatarImage
                            alt={item.name}
                            src={item.image}
                            loading="lazy"
                          />
                          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <h3 className="font-bold text-foreground text-base tracking-tight leading-none">
                            {item.name}
                          </h3>
                          <span className="text-muted-foreground text-xs mt-1">
                            {item.role}
                          </span>
                          <blockquote className="mt-3">
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                              &quot;{item.quote}&quot;
                            </p>
                          </blockquote>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </div>
            );
          })}

          {/* Gradient Overlays (Tailwind v4 syntax) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background via-background/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/80 to-transparent z-10" />
        </div>
      </Container>
    </SectionWrapper>
  );
}
