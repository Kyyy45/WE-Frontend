import { StudentGuard } from "@/components/auth/student-guard"
// Import sidebar siswa Anda disini...

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentGuard>
       {/* Struktur Layout Siswa */}
       {children}
    </StudentGuard>
  )
}