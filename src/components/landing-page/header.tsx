"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggleButton } from "../theme/theme-toggle";
import { motion } from "motion/react";
import { Container } from "@/components/layout/container";

const menuItems = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/about" },
  { name: "Program", href: "/courses" },
  { name: "Kontak", href: "/kontak" },
];

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-999 w-full px-2"
      >
        <Container
          size={isScrolled ? "narrow" : "default"}
          className={cn(
            "mx-auto mt-2 transition-all duration-300",
            isScrolled &&
              "bg-background/50 rounded-2xl backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between lg:w-auto lg:gap-6">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <ul
                className="relative hidden items-center gap-0.5 text-sm lg:flex"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {menuItems.map((item, index) => (
                  <li key={item.name} className="relative">
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredIndex(index)}
                      className="relative block px-4 py-2 text-muted-foreground hover:text-primary"
                    >
                      {hoveredIndex === index && (
                        <motion.span
                          layoutId="nav-hover"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 transition-colors",
                          hoveredIndex === index
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 lg:hidden">
                <ThemeToggleButton />
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Close Menu" : "Open Menu"}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-primary/10 text-muted-foreground hover:text-primary"
                >
                  <Menu className="size-8 in-data-[state=active]:scale-0 transition-all" />
                  <X className="absolute size-8 scale-0 in-data-[state=active]:scale-100 transition-all" />
                </button>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 shadow-2xl shadow-primary/10 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground hover:text-primary duration-150"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href="/login">Login</Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href="/register">Sign Up</Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "flex",
                    isScrolled ? "lg:inline-flex" : "lg:hidden"
                  )}
                >
                  <Link href="/get-started">Get Started</Link>
                </Button>

                <div className="hidden lg:block">
                  <ThemeToggleButton />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
};
