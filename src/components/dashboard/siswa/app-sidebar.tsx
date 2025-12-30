"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, LayoutDashboard, CreditCard, X } from "lucide-react";

import { NavMain } from "@/components/dashboard/siswa/nav-main";
import { NavUser } from "@/components/dashboard/siswa/nav-user";
import { LogoIcon } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
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
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center">
          <SidebarMenu className="flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center">
                    <LogoIcon className="size-8 bg-foreground dark:bg-primary/10 rounded-full border-border/60" />
                  </div>

                  <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
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

          {/* Tombol Close (Hanya Muncul di Mobile) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={() => setOpenMobile(false)}
            >
              <X className="size-5" />
            </Button>
          )}
        </div>
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
