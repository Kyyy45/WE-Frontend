"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // 1. Jika belum login, middleware sebenarnya sudah handle, 
    // tapi double check disini biar aman.
    if (!isAuthenticated || !user) {
      router.replace("/login")
      return
    }

    // 2. Logic Dispatcher (Polisi Lalu Lintas)
    if (user.role === "admin") {
      router.replace("/dashboard/admin")
    } else {
      // Asumsi selain admin adalah 'user' (siswa)
      router.replace("/dashboard/siswa")
    }
  }, [isAuthenticated, user, router])

  // Tampilkan loading screen kosong saat proses redirect
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}