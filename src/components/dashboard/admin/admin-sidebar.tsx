"use client";

import * as React from "react";
import {
  BookOpen,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings2,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/layout/logo";
import { useAuthStore } from "@/stores/auth-store";

// Menu Data untuk Admin
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Kelola Pengguna",
      url: "/dashboard/admin/users",
      icon: Users,
      items: [
        { title: "Daftar User", url: "/dashboard/admin/users" },
        { title: "Admin & Staff", url: "/dashboard/admin/users/staff" },
      ],
    },
    {
      title: "Kursus & Materi",
      url: "/dashboard/admin/courses",
      icon: BookOpen,
      items: [
        { title: "Semua Kursus", url: "/dashboard/admin/courses" },
        { title: "Tambah Kursus", url: "/dashboard/admin/courses/new" },
      ],
    },
    {
      title: "Keuangan",
      url: "/dashboard/admin/payments",
      icon: CreditCard,
      items: [
        { title: "Transaksi", url: "/dashboard/admin/payments" },
        { title: "Pendaftaran", url: "/dashboard/admin/enrollments" },
      ],
    },
    {
      title: "Formulir",
      url: "/dashboard/admin/forms",
      icon: FileText,
    },
    {
      title: "Pengaturan",
      url: "/dashboard/admin/settings",
      icon: Settings2,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  // Fallback data agar tidak crash saat loading
  const userData = {
    name: user?.fullName || "Admin",
    email: user?.email || "admin@we.com",
    avatar: user?.avatarUrl || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Admin Area" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
