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
    <p className="text-[0.8rem] font-medium text-red-500 mt-1">{msg}</p>
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

      toast.success("Kode baru berhasil dikirim!");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              <Mail className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold">Verifikasi Akun</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Masukkan email yang Anda daftarkan untuk menerima kode aktivasi
              baru.
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              disabled={isSubmitting}
            />
            <ErrorMsg msg={errors.email?.message} />
          </Field>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Kirim Kode"
            )}
          </Button>

          <div className="text-center text-sm">
            <Link
              href="/login"
              className="text-muted-foreground underline hover:text-primary"
            >
              Kembali ke Login
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
