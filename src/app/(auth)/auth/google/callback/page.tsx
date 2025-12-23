'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    // 1. Ambil Token dari URL yang dikirim backend
    const accessToken = searchParams.get('accessToken');
    const error = searchParams.get('error');

    if (error) {
       toast.error("Gagal login dengan Google");
       router.push('/login');
       return;
    }

    if (accessToken) {
      // 2. Simpan token ke Store
      setAccessToken(accessToken);
      
      toast.success("Login Google berhasil!");
      
      // 3. Redirect ke dashboard
      // Note: Data user (profile) akan di-fetch otomatis nanti di layout dashboard 
      // atau bisa fetch manual di sini jika mau.
      router.push('/dashboard');
    } else {
       // Jika tidak ada token, kembali ke login
       router.push('/login');
    }
  }, [router, searchParams, setAccessToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-gray-500">Memproses login Google...</p>
    </div>
  );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GoogleCallback />
        </Suspense>
    )
}