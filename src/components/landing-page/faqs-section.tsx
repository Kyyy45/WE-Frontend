"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQSection() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "clock",
      question: "Kapan jam operasional Worldpedia?",
      answer:
        "Tim layanan kami tersedia Senin hingga Jumat pukul 09:00 - 20:00 WIB, dan akhir pekan pukul 10:00 - 18:00 WIB.",
    },
    {
      id: "item-2",
      icon: "credit-card",
      question: "Bagaimana sistem pembayaran kursusnya?",
      answer:
        "Pembayaran dapat dilakukan melalui transfer bank atau e-wallet. Kami menyediakan opsi pembayaran cicilan untuk program intensif tertentu.",
    },
    {
      id: "item-3",
      icon: "book-open",
      question: "Apakah ada placement test?",
      answer:
        "Ya, setiap calon siswa akan mendapatkan placement test gratis untuk menentukan level kelas yang paling sesuai dengan kemampuan saat ini.",
    },
    {
      id: "item-4",
      icon: "users",
      question: "Apakah pengajarnya profesional?",
      answer:
        "Seluruh pengajar kami adalah praktisi bahasa Inggris bersertifikat dengan pengalaman mengajar standar internasional (IELTS/TOEFL).",
    },
    {
      id: "item-5",
      icon: "award",
      question: "Apakah saya mendapatkan sertifikat?",
      answer:
        "Ya, setiap siswa yang menyelesaikan program akan mendapatkan sertifikat resmi dari Worldpedia Education sebagai bukti pencapaian level.",
    },
  ];

  return (
    <SectionWrapper className="bg-background">
      <Container className="py-12 md:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-28 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
                Pertanyaan <br className="hidden lg:block" />
                <span className="text-primary font-serif italic font-normal">
                  Umum
                </span>
              </h2>
              <p className="text-muted-foreground mt-6 text-base md:text-lg leading-relaxed max-w-sm mx-auto lg:mx-0">
                Temukan Jawaban untuk Pertanyaan Umum Seputar Worldpedia
                Education.
              </p>
            </div>
          </div>

          <div className="lg:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-card rounded-3xl border border-border px-2 md:px-4 shadow-sm shadow-primary/5 overflow-hidden transition-all duration-300"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-6 hover:no-underline group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex size-10 shrink-0 rounded-xl border border-border bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-5"
                        />
                      </div>
                      <span className="text-base md:text-lg font-bold text-foreground tracking-tight">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="pl-14 pr-4">
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
