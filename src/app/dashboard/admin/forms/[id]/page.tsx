"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { FormBuilder } from "@/components/dashboard/admin/forms/form-builder";
import { Form } from "@/types/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditFormPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Form | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/forms/${id}`);
        setFormData(data.data || data);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat form.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchForm();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (!formData)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Form tidak ditemukan
      </div>
    );

  return <FormBuilder initialData={formData} isEditMode />;
}
