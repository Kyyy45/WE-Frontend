"use client";

import { AppSidebar } from "@/components/dashboard/admin/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard/admin/dashboard-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggleButton } from "@/components/theme/theme-toggle";
import { RoleGuard } from "@/components/auth/role-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-sidebar-border/50 sticky top-0 bg-background/95 backdrop-blur z-10 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DashboardBreadcrumb />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggleButton />
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  );
}
