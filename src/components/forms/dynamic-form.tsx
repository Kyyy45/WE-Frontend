"use client";

import { useState } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { Form, FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface DynamicFormProps {
  formStructure: Form;
  courseId: string; // ID Kursus untuk redirect ke checkout
}

export function DynamicForm({ formStructure, courseId }: DynamicFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsSubmitting(true);

      // POST ke Backend: /forms/public/:slug/submissions
      await api.post(`/forms/public/${formStructure.slug}/submissions`, data);

      toast.success("Formulir berhasil dikirim!");

      // Redirect ke Checkout Kursus dengan ID Course
      router.push(`/checkout/${courseId}`);
    } catch (err: unknown) {
      console.error("Submission error:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 400 && err.response?.data?.errors) {
          toast.error("Mohon periksa kembali isian Anda.");
        } else {
          toast.error(err.response?.data?.message || "Gagal mengirim formulir");
        }
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sorting field berdasarkan order
  const sortedFields = [...formStructure.fields].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {sortedFields.map((field) => {
        // Render Header
        if (field.type === "header") {
          return (
            <div key={field.key} className="pt-6 pb-2">
              <h3 className="text-xl font-bold text-foreground border-b pb-2 mb-2">
                {field.label}
              </h3>
              {field.helpText && (
                <p className="text-sm text-muted-foreground">
                  {field.helpText}
                </p>
              )}
            </div>
          );
        }

        // Render Input Fields
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={field.key}
                className="text-sm font-medium flex items-center gap-1"
              >
                {field.label}{" "}
                {field.required && <span className="text-destructive">*</span>}
              </Label>

              {field.helpText && (
                <p className="text-[0.8rem] text-muted-foreground">
                  {field.helpText}
                </p>
              )}
            </div>

            {/* Input Renderer */}
            {renderInput(field, register)}

            {/* Error Message */}
            {errors[field.key] && (
              <p className="text-[0.8rem] font-medium text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {(errors[field.key]?.message as string) || "Wajib diisi"}
              </p>
            )}
          </div>
        );
      })}

      <div className="pt-8">
        <Button
          type="submit"
          className="w-full h-12 text-base font-bold shadow-md transition-transform active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan Data...
            </>
          ) : (
            "Simpan & Lanjut Pembayaran"
          )}
        </Button>
      </div>
    </form>
  );
}

// Helper untuk render berbagai tipe input
function renderInput(field: FormField, register: UseFormRegister<FieldValues>) {
  const commonProps = {
    id: field.key,
    placeholder: field.placeholder,
    ...register(field.key, {
      required: field.required ? "Field ini wajib diisi" : false,
    }),
  };

  const inputClass = "w-full bg-background";

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          {...commonProps}
          className={`${inputClass} min-h-30 resize-y`}
        />
      );

    case "select":
      return (
        <div className="relative">
          <select
            {...commonProps}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="">-- Pilih Opsi --</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Chevron Icon */}
          <div className="absolute right-3 top-3 pointer-events-none text-muted-foreground">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="flex flex-col gap-3 pt-1">
          {field.options?.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                value={opt.value}
                {...register(field.key, { required: field.required })}
                className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary accent-primary"
              />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="flex flex-col gap-3 pt-1">
          {field.options?.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={opt.value}
                {...register(field.key, { required: field.required })}
                className="h-4 w-4 rounded border-primary text-primary shadow focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-primary"
              />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      );

    case "date":
      return <Input type="date" {...commonProps} className={inputClass} />;
    case "number":
      return <Input type="number" {...commonProps} className={inputClass} />;
    case "email":
      return <Input type="email" {...commonProps} className={inputClass} />;
    case "phone":
      return <Input type="tel" {...commonProps} className={inputClass} />;
    case "text":
    default:
      return <Input type="text" {...commonProps} className={inputClass} />;
  }
}
