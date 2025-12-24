"use client"

import { useAuthStore } from "@/stores/auth-store"

export default function Page() {
  const { user } = useAuthStore()
  const displayName = user?.fullName || user?.username || "Siswa"

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* 1. Header Area */}
      <div className="mb-2">
         <h1 className="text-2xl font-bold tracking-tight">Selamat Datang, {displayName}!</h1>
         <p className="text-muted-foreground">Ini adalah tampilan dashboard area siswa.</p>
      </div>

      {/* 2. Grid Utama (Responsive Check) */}
      {/* Mobile: 1 kolom, Tablet/Desktop: 3 kolom */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 border border-border flex items-center justify-center p-6 text-center">
            <div>
               <p className="font-bold text-lg">Statistik 1</p>
               <p className="text-sm text-muted-foreground">Placeholder Grid 1</p>
            </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 border border-border flex items-center justify-center p-6 text-center">
             <div>
               <p className="font-bold text-lg">Statistik 2</p>
               <p className="text-sm text-muted-foreground">Placeholder Grid 2</p>
            </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 border border-border flex items-center justify-center p-6 text-center">
             <div>
               <p className="font-bold text-lg">Statistik 3</p>
               <p className="text-sm text-muted-foreground">Placeholder Grid 3</p>
            </div>
        </div>
      </div>

      {/* 3. Long Content Area */}
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 border border-border md:min-h-min p-8">
         <div className="h-full border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Area Konten Utama (Akan diisi List Kelas)</p>
         </div>
      </div>
    </div>
  )
}