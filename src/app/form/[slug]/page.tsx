"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter, notFound } from "next/navigation";
import { api } from "@/lib/axios";
import { Form } from "@/types/form";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { Header } from "@/components/landing-page/header";
import { Container } from "@/components/layout/container";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";

export default function FormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const slug = params.slug as string;
  const courseId = searchParams.get("courseId");

  const [formStructure, setFormStructure] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  // Validasi: Form harus diakses dalam konteks kursus (harus ada courseId)
  useEffect(() => {
    if (!courseId) {
       router.replace("/courses");
    }
  }, [courseId, router]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        // Endpoint Backend: GET /forms/public/:slug
        const { data } = await api.get(`/forms/public/${slug}`);
        setFormStructure(data.data);
      } catch (err: unknown) {
        console.error("Error fetching form:", err);
        if (err instanceof AxiosError) {
             if (err.response?.status === 404) {
                 notFound();
             }
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchForm();
    }
  }, [slug]);

  if (!courseId) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-20 flex flex-col items-center justify-center bg-muted/20">
        <Container className="max-w-2xl w-full">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0 hover:pl-2 transition-all text-muted-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Detail Kursus
          </Button>

          {loading ? (
             <div className="flex flex-col items-center py-20 bg-card rounded-2xl border border-border p-12">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Memuat formulir...</p>
             </div>
          ) : formStructure ? (
             <div className="bg-card border border-border rounded-2xl shadow-xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8 border-b border-border/50 pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">{formStructure.name}</h1>
                  {formStructure.description && (
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {formStructure.description}
                    </p>
                  )}
                </div>
                
                {/* Render Form Dinamis */}
                <DynamicForm formStructure={formStructure} courseId={courseId} />
             </div>
          ) : (
             <div className="text-center py-20">
                <p>Formulir tidak ditemukan.</p>
             </div>
          )}
        </Container>
      </main>
    </div>
  );
}