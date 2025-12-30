"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resendVerificationSchema,
  type ResendVerificationValues,
} from "@/lib/validations";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs font-medium text-destructive mt-1.5">{msg}</p>
  ) : null;

export function ResendVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationValues>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const onSubmit = async (data: ResendVerificationValues) => {
    try {
      await api.post("/auth/activation/send", data);
      toast.success("Kode baru berhasil dikirim! Silakan cek email.");
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal mengirim kode");
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 md:gap-8", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-sm ring-1 ring-inset ring-primary/20">
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Verifikasi Akun
            </h1>
            <p className="text-muted-foreground text-sm md:text-base text-balance max-w-[90%]">
              Masukkan email yang Anda daftarkan untuk menerima kode aktivasi
              baru.
            </p>
          </div>

          <Field>
            <FieldLabel
              htmlFor="email"
              className="text-sm md:text-base font-medium"
            >
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              disabled={isSubmitting}
              className="bg-background h-10 md:h-11"
            />
            <ErrorMsg msg={errors.email?.message} />
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 md:h-11 font-semibold text-base mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Kirim Kode"
            )}
          </Button>

          <div className="text-center text-sm md:text-base mt-4">
            <Link
              href="/login"
              className="text-muted-foreground underline hover:text-primary transition-colors underline-offset-4"
            >
              Kembali ke Login
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
