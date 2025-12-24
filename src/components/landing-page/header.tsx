"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggleButton } from "../theme/theme-toggle";
import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import { useAuthStore } from "@/stores/auth-store";

const menuItems = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/about" },
  { name: "Program", href: "/courses" },
  { name: "Kontak", href: "/kontak" },
];

export const Header = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { isAuthenticated, user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardLink =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/siswa";

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
              "bg-background/80 rounded-2xl backdrop-blur-md lg:px-5 border border-border/50 shadow-sm"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* LOGO AREA */}
            <div className="flex w-full items-center justify-between lg:w-auto lg:gap-6">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              {/* DESKTOP MENU */}
              <ul
                className="relative hidden items-center gap-1 text-sm lg:flex"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {menuItems.map((item, index) => (
                  <li key={item.name} className="relative">
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredIndex(index)}
                      className="relative block px-4 py-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {hoveredIndex === index && (
                        <motion.span
                          layoutId="nav-hover"
                          className="absolute inset-0 rounded-full bg-primary/10"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 font-medium",
                          hoveredIndex === index
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* MOBILE TOGGLE */}
              <div className="flex items-center gap-2 lg:hidden">
                <ThemeToggleButton />
                <button
                  onClick={() => setMenuState(!menuState)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-primary/10 text-muted-foreground hover:text-primary"
                >
                  <Menu
                    className="size-6 transition-all data-[state=active]:scale-0"
                    data-state={menuState ? "active" : "inactive"}
                  />
                  {menuState && <X className="absolute size-6" />}
                </button>
              </div>
            </div>

            {/* ACTION AREA */}
            <div className="bg-background lg:bg-transparent in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 shadow-2xl shadow-primary/10 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              {/* Mobile Menu List */}
              <div className="lg:hidden">
                <ul className="space-y-4 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block py-2 text-muted-foreground hover:text-primary font-medium duration-150 border-b border-border/50"
                        onClick={() => setMenuState(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AUTH BUTTONS */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit items-center">
                {isMounted && isAuthenticated ? (
                  <Button
                    asChild
                    size="sm"
                    className="w-full sm:w-auto shadow-lg shadow-primary/20 rounded-full px-6"
                  >
                    <Link href={dashboardLink}>Dashboard</Link>
                  </Button>
                ) : (
                  // Tombol Belum Login
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full sm:w-auto hover:bg-primary/10 hover:text-primary",
                        isScrolled && "lg:hidden"
                      )}
                    >
                      <Link href="/login">Login</Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        "w-full sm:w-auto shadow-lg shadow-primary/20 rounded-full px-6",
                        isScrolled && "lg:hidden"
                      )}
                    >
                      <Link href="/register">Sign Up</Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        "w-full sm:w-auto shadow-lg shadow-primary/20 rounded-full px-6",
                        "flex",
                        isScrolled ? "lg:inline-flex" : "lg:hidden"
                      )}
                    >
                      <Link href="/get-started">Get Started</Link>
                    </Button>
                  </>
                )}

                <div className="hidden lg:block ml-2">
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
