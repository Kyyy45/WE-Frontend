"use client";

import * as React from "react";
import {
  BookOpen,
  SquareTerminal,
  Wallet,
  Command,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";

import { NavUser } from "@/components/dashboard/nav-user";
import { NavMain } from "@/components/dashboard/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

// DATA MENU SISWA
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/student",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Kelas Saya",
      url: "/dashboard/student/enrollments",
      icon: BookOpen,
    },
    {
      title: "Riwayat Pembayaran",
      url: "/dashboard/student/payments",
      icon: Wallet,
    },
    {
        title: "Bantuan",
        url: "/dashboard/student/support",
        icon: LifeBuoy,
    }
  ],
};

export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userProfile } = useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getMe(),
  });
  const user = userProfile?.data;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/student">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-yellow-500 text-white">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Worldpedia</span>
                  <span className="truncate text-xs">Learning Center</span>
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
        {user && (
          <NavUser
            user={{
              name: user.fullName,
              email: user.email,
              avatar: user.avatarUrl || "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}