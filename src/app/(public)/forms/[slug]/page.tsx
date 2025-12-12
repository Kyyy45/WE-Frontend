"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormRenderer } from "@/components/form/form-renderer";
import { formService } from "@/services/form.service";
import { SubmitFormRequest } from "@/types/form"; // Import Tipe
import { ApiError } from "@/services/api"; // Import Tipe

export default function PublicFormPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const courseId = searchParams.get("courseId");

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["form", slug],
    queryFn: () => formService.getFormBySlug(slug as string),
    retry: false,
  });
  
  const formData = response?.data;

  const { mutate: submitForm, isPending } = useMutation({
    // FIX: Gunakan tipe SubmitFormRequest
    mutationFn: (answers: SubmitFormRequest) => formService.submitForm(slug as string, answers),
    onSuccess: () => {
      toast.success("Data pendaftaran berhasil disimpan!");
      
      if (courseId) {
        router.push(`/checkout?courseId=${courseId}`); 
      } else {
        router.push("/");
      }
    },
    // FIX: Gunakan tipe ApiError
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal mengirim data. Coba lagi.");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat formulir...</p>
      </div>
    );
  }

  if (isError || !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500">Formulir Tidak Ditemukan</h2>
        <p className="text-muted-foreground">Link yang Anda akses mungkin salah atau kadaluarsa.</p>
        <Button asChild variant="outline"><Link href="/">Kembali ke Beranda</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-transparent pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>

        <Card className="border-t-4 border-t-primary shadow-xl">
          <CardHeader className="space-y-4">
            <div>
                <CardTitle className="text-2xl md:text-3xl font-jakarta mb-2">{formData.name}</CardTitle>
                <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                {formData.description || "Silakan lengkapi data di bawah ini dengan benar."}
                </CardDescription>
            </div>
            
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Data Anda aman dan terenkripsi.</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <FormRenderer 
              fields={formData.fields} 
              onSubmit={submitForm} 
              isSubmitting={isPending}
              submitLabel={courseId ? "Lanjut ke Pembayaran" : "Kirim Data"}
            />
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Worldpedia Education. All rights reserved.
        </p>
      </div>
    </div>
  );
}