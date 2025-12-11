"use client";

import * as React from "react";
import {
  BookOpen,
  Frame,
  PieChart,
  Settings2,
  Users,
  Wallet,
  Command,
  FileText,
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

// DATA MENU ADMIN (Sesuai Endpoint Backend)
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Manajemen User",
      url: "/dashboard/admin/users",
      icon: Users,
      // Jika nanti butuh sub-menu (misal: Admin List, Student List) bisa ditambah 'items'
    },
    {
      title: "Kursus (Course)",
      url: "/dashboard/admin/courses",
      icon: BookOpen,
      items: [
        { title: "Daftar Kursus", url: "/dashboard/admin/courses" },
        { title: "Tambah Kursus", url: "/dashboard/admin/courses/create" },
      ]
    },
    {
      title: "Dynamic Forms",
      url: "/dashboard/admin/forms",
      icon: FileText,
      items: [
        { title: "Form Builder", url: "/dashboard/admin/forms" },
        { title: "Submissions", url: "/dashboard/admin/forms/submissions" },
      ]
    },
    {
      title: "Pendaftaran",
      url: "/dashboard/admin/enrollments",
      icon: Frame,
    },
    {
      title: "Transaksi & Bayar",
      url: "/dashboard/admin/payments",
      icon: Wallet,
    },
    {
      title: "Pengaturan",
      url: "/dashboard/admin/settings",
      icon: Settings2,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <Link href="/dashboard/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Worldpedia</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Render NavMain dengan data Admin */}
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.fullName,
              email: user.email,
              avatar: user.avatarUrl || "",
              role: user.role,
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}