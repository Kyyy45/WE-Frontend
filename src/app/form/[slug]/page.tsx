"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useRouter,
  notFound,
} from "next/navigation";
import { api } from "@/lib/axios";
import { Form } from "@/types/form";
import { ApiResponse } from "@/types/api";
import { DynamicForm } from "@/components/forms/dynamic-form"; // Pastikan path import benar
import { Header } from "@/components/landing-page/header";
import { Container } from "@/components/layout/container";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";

export default function FormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL: /form/[slug]?courseId=...
  const slug = params.slug as string;
  const courseId = searchParams.get("courseId");

  const [formStructure, setFormStructure] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Validasi Context: Harus ada courseId
  useEffect(() => {
    if (!courseId) {
      // Jika user iseng akses /form/slug tanpa courseId, lempar balik ke katalog
      router.replace("/courses");
    }
  }, [courseId, router]);

  // 2. Fetch Form Structure
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        // Endpoint Backend: GET /forms/public/:slug
        const { data } = await api.get<ApiResponse<Form>>(
          `/forms/public/${slug}`
        );
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

  if (!courseId) return null; // Mencegah flash content sebelum redirect

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
            Kembali
          </Button>

          {loading ? (
            <div className="flex flex-col items-center py-20 bg-card rounded-2xl border border-border p-12 shadow-sm">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground font-medium">
                Memuat formulir...
              </p>
            </div>
          ) : formStructure ? (
            <div className="bg-card border border-border rounded-2xl shadow-xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 border-b border-border/50 pb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-foreground">
                  {formStructure.name}
                </h1>
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
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">
                Formulir tidak ditemukan atau sudah tidak aktif.
              </p>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
