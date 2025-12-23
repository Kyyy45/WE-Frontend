import { AdminGuard } from "@/components/auth/admin-guard"
// Import sidebar admin Anda disini...

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
       {/* Struktur Layout Admin */}
       {children}
    </AdminGuard>
  )
}