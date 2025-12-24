"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, LayoutDashboard, CreditCard } from "lucide-react";

import { NavMain } from "@/components/dashboard/siswa/nav-main";
import { NavUser } from "@/components/dashboard/siswa/nav-user";
import { LogoIcon } from "@/components/layout/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Data Menu Dashboard Siswa
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/siswa",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Akademik",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Kelas Saya",
          url: "/dashboard/siswa/courses",
        },
        {
          title: "Katalog Baru",
          url: "/courses",
        },
      ],
    },
    {
      title: "Tagihan",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Riwayat Transaksi",
          url: "/dashboard/siswa/payments",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                {/* [UPDATE] Menyamakan style background dengan Header */}
                <div className="flex aspect-square size-8 items-center justify-center">
                  <LogoIcon className="size-8 bg-foreground dark:bg-primary/10 rounded-full border-border/60" />
                </div>

                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-bold text-sm tracking-tight uppercase text-sidebar-foreground">
                    Worldpedia
                  </span>
                  <span className="truncate text-[10px] font-medium tracking-[0.2em] uppercase opacity-80 text-sidebar-foreground">
                    Education
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
