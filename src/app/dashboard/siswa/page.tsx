export default function StudentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang! 👋</h1>
        <p className="text-muted-foreground">Siap untuk mempelajari hal baru hari ini?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Progress Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
           <div className="font-semibold">Kelas Sedang Dipelajari</div>
           <div className="mt-4 text-2xl font-bold">Fullstack Web Dev</div>
           <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-[65%]" />
           </div>
           <p className="text-xs text-muted-foreground mt-2">Progress: 65%</p>
        </div>

        {/* Stats Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
           <div className="font-semibold">Sertifikat Dimiliki</div>
           <div className="mt-4 text-3xl font-bold text-green-600">2</div>
        </div>
      </div>
      
      {/* Course List Placeholder */}
      <div className="min-h-75 rounded-xl border bg-card shadow p-6">
         <h2 className="text-xl font-bold mb-4">Rekomendasi Untukmu</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center border">
                    Course Thumbnail {i}
                </div>
            ))}
         </div>
      </div>
    </div>
  )
}