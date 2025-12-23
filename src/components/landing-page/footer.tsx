"use client";

import { Logo } from "@/components/layout/logo";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import {
  IconMapPin,
  IconPhone,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
} from "@tabler/icons-react";

const footerLinks = [
  {
    group: "Program",
    items: [
      { title: "IELTS Preparation", href: "#" },
      { title: "TOEFL Preparation", href: "#" },
      { title: "Speaking Class", href: "#" },
      { title: "General English", href: "#" },
    ],
  },
  {
    group: "Company",
    items: [
      { title: "Tentang Kami", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Komunitas", href: "#" },
    ],
  },
  {
    group: "Support",
    items: [
      { title: "Hubungi Kami", href: "#" },
      { title: "Syarat dan Ketentuan", href: "#" },
      { title: "Kebijakan Privasi", href: "#" },
    ],
  },
];

export default function FooterSection() {
  return (
    <SectionWrapper className="bg-background">
      <Container className="pb-12 md:pb-24">
        <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-12 lg:p-16 shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <div className="flex flex-col max-w-md">
              <Link
                href="/"
                className="block size-fit mb-8 transition-opacity hover:opacity-80"
              >
                <Logo />
              </Link>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-10">
                Worldpedia Education adalah platform pembelajaran untuk membantu
                kamu menguasai bahasa Inggris dan menjadi digital talent terbaik
                dengan standar global.
              </p>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <Link
                  href="https://www.google.com/maps/search/?api=1&query=Jl.+HRA+Rahman+Gg.+Panti+Jaya+No.+03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <IconMapPin size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/60 group-hover:text-primary">
                      Lokasi
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      Jl. HRA Rahman Gg. Panti Jaya No. 03
                    </span>
                  </div>
                </Link>

                <Link
                  href="https://wa.me/62895421277277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <IconPhone size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/60 group-hover:text-primary">
                      WhatsApp
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      +62 895-4212-77277
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
              {footerLinks.map((group, index) => (
                <div key={index} className="flex flex-col gap-6">
                  <h3 className="text-foreground font-bold text-sm uppercase tracking-widest">
                    {group.group}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {group.items.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground text-sm md:text-base hover:text-primary transition-colors duration-200"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Worldpedia Education. All Rights
              Reserved.
            </p>

            <div className="flex items-center justify-center gap-3">
              <SocialLink
                href="https://www.instagram.com/worldpedia.ptk/"
                icon={<IconBrandInstagram size={22} />}
                label="Instagram"
              />
              <SocialLink
                href="https://www.tiktok.com/@worldpedia.ptk"
                icon={<IconBrandTiktok size={22} />}
                label="TikTok"
              />
              <SocialLink
                href="#"
                icon={<IconBrandLinkedin size={22} />}
                label="LinkedIn"
              />
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
