"use client";

import * as React from "react";
import { BookOpen, LayoutDashboard, Trophy, UserCircle } from "lucide-react";

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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/siswa",
      icon: LayoutDashboard,
    },
    {
      title: "Kelas Saya",
      url: "/dashboard/siswa/courses",
      icon: BookOpen,
    },
    {
      title: "Sertifikat",
      url: "/dashboard/siswa/certificates",
      icon: Trophy,
    },
    {
      title: "Profil Saya",
      url: "/dashboard/siswa/profile",
      icon: UserCircle,
    },
  ],
};

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const userData = {
    name: user?.fullName || "Siswa",
    email: user?.email || "siswa@we.com",
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
        <NavMain items={data.navMain} label="Menu Belajar" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
