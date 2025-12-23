'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const error = searchParams.get('error');

    if (error) {
       toast.error("Gagal login: " + error);
       router.replace('/login');
       return;
    }

    if (accessToken) {
      const processLogin = async () => {
        try {
          useAuthStore.getState().setAccessToken(accessToken);
          
          // Fetch user profile untuk update state
          let userData = null;
          try {
             const { data } = await api.get('/users/me');
             userData = data.data;
          } catch {
             // Fallback minimal
             userData = { _id: "google", fullName: "User", role: "user" }; 
          }

          setAuth(userData, accessToken);
          toast.success("Login berhasil!");
          
          // ⚠️ WAJIB PAKAI INI AGAR COOKIE TERBACA
          window.location.href = '/dashboard/siswa'; 
          
        } catch (err) {
          router.replace('/login');
        }
      };
      processLogin();
    } else {
       router.replace('/login');
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Menyiapkan dashboard Anda...</p>
      </div>
    </div>
  );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <GoogleCallbackContent />
        </Suspense>
    )
}