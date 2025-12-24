"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Form, FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DynamicFormProps {
  formStructure: Form;
  courseId: string;
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
      await api.post(`/forms/public/${formStructure.slug}/submissions`, data);
      toast.success("Formulir berhasil dikirim!");
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

  const sortedFields = [...formStructure.fields].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {sortedFields.map((field) => {
        if (field.type === "header") {
          return (
            <div key={field.key} className="pt-4 pb-2">
              <h3 className="text-lg font-semibold text-foreground border-b pb-1">
                {field.label}
              </h3>
              {field.helpText && (
                <p className="text-sm text-muted-foreground mt-1">
                  {field.helpText}
                </p>
              )}
            </div>
          );
        }

        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor={field.key}
                className="text-sm font-medium leading-none"
              >
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              {field.helpText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle
                        size={14}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{field.helpText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {renderInput(field, register)}

            {errors[field.key] && (
              <p className="text-[0.8rem] font-medium text-destructive flex items-center gap-1">
                <AlertCircle size={12} />
                {(errors[field.key]?.message as string) || "Wajib diisi"}
              </p>
            )}
          </div>
        );
      })}

      <div className="pt-6">
        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan Data...
            </>
          ) : (
            "Kirim Data & Lanjutkan"
          )}
        </Button>
      </div>
    </form>
  );
}

function renderInput(field: FormField, register: any) {
  const commonProps = {
    id: field.key,
    placeholder: field.placeholder,
    className: "w-full",
    ...register(field.key, {
      required: field.required ? "Field ini wajib diisi" : false,
    }),
  };

  const selectClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  switch (field.type) {
    case "textarea":
      return <Textarea {...commonProps} className="min-h-25" />;

    case "select":
      return (
        <div className="relative">
          <select {...commonProps} className={`${selectClass} appearance-none`}>
            <option value="">-- Pilih Opsi --</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                value={opt.value}
                {...register(field.key, { required: field.required })}
                className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary"
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
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={opt.value}
                {...register(field.key, { required: field.required })}
                className="h-4 w-4 rounded border-primary text-primary shadow focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      );

    case "date":
      return <Input type="date" {...commonProps} />;
    case "number":
      return <Input type="number" {...commonProps} />;
    case "email":
      return <Input type="email" {...commonProps} />;
    case "phone":
      return <Input type="tel" {...commonProps} />;
    case "text":
    default:
      return <Input type="text" {...commonProps} />;
  }
}
