import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* BAGIAN KIRI: Form */}
      <div className="flex items-center justify-center p-6 md:p-10 h-screen overflow-y-auto bg-background">
        <div className="w-full max-w-[350px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold font-jakarta tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground text-balance">
              {description}
            </p>
          </div>

          <div className="w-full">{children}</div>

          <p className="px-8 text-center text-xs text-muted-foreground">
            &copy; 2025 Worldpedia Education.
          </p>
        </div>
      </div>

      {/* BAGIAN KANAN: Image */}
      <div className="hidden lg:block relative h-screen bg-muted text-white">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop"
            alt="Worldpedia Education Environment"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
            quality={90}
          />
        </div>

        <div className="relative z-20 flex h-full flex-col justify-between p-10">
          <div className="flex items-center text-lg font-medium font-jakarta text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Worldpedia Education
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              &quot;Pendidikan adalah senjata paling ampuh yang dapat Anda
              gunakan untuk mengubah dunia.&quot;
            </p>
            <footer className="text-sm font-medium text-zinc-300">
              Nelson Mandela
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
