'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
import { useAuthStore } from '@/stores/auth-store'; //
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import { api } from '@/lib/axios'; // Uncomment jika sudah ada fetch profile

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken); //
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken'); //
    const error = searchParams.get('error');

    if (error) {
       console.error("Google Auth Error:", error);
       toast.error("Gagal login dengan Google");
       router.replace('/login');
       return;
    }

    if (accessToken) {
      // 1. Simpan Access Token ke State (Memory)
      useAuthStore.getState().setAccessToken(accessToken);
      
      toast.success("Login berhasil!");
      
      // 2. PERBAIKAN UTAMA: Gunakan Hard Navigation
      // Jangan pakai router.push('/dashboard'). 
      // Router Next.js terlalu cepat, Middleware belum melihat cookie baru.
      window.location.href = '/dashboard'; 
      
    } else {
       router.replace('/login');
    }
  }, [searchParams, setAccessToken, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-gray-500 font-medium">Sedang memverifikasi data Google...</p>
    </div>
  );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <GoogleCallbackContent />
        </Suspense>
    )
}