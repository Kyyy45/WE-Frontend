export default function AdminPage() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {/* Statistik Cards */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="font-semibold leading-none tracking-tight">Total User</div>
        <div className="mt-4 text-3xl font-bold">1,234</div>
        <p className="text-xs text-muted-foreground mt-2">+20% dari bulan lalu</p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="font-semibold leading-none tracking-tight">Pendapatan</div>
        <div className="mt-4 text-3xl font-bold">Rp 45.2jt</div>
        <p className="text-xs text-muted-foreground mt-2">+15% dari bulan lalu</p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="font-semibold leading-none tracking-tight">Kursus Aktif</div>
        <div className="mt-4 text-3xl font-bold">12</div>
        <p className="text-xs text-muted-foreground mt-2">3 kursus baru ditambahkan</p>
      </div>

      {/* Main Content Area */}
      <div className="min-h-screen rounded-xl border bg-card shadow md:col-span-3 p-6">
         <h2 className="text-xl font-bold mb-4">Aktivitas Terbaru</h2>
         <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
            Grafik atau Tabel Aktivitas akan muncul di sini.
         </div>
      </div>
    </div>
  )
}