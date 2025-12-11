"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ThemeProvider } from "@/components/themes/theme-provider"; // Sesuaikan path ini jika berbeda
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  // useState memastikan QueryClient hanya dibuat sekali saat inisialisasi di sisi client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Data dianggap "segar" selama 1 menit
            retry: 1, // Retry 1x jika gagal fetch
            refetchOnWindowFocus: false, // Optional: matikan refresh saat pindah tab
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        
        {/* Global Toaster untuk notifikasi */}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          theme="system" 
        />
        
        {/* Devtools hanya muncul di mode development */}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}