"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/lib/validations";
import Link from "next/link";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs font-medium text-destructive mt-1.5 animate-in slide-in-from-top-1">
      {msg}
    </p>
  ) : null;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Registrasi berhasil! Cek email untuk kode verifikasi.");

      // Redirect ke verify dengan params email
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal registrasi");
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-5 md:gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Buat Akun Worldpedia Education
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Bergabunglah dengan Worldpedia Education dan mulai perjalanan
            belajar Anda hari ini.
          </p>
        </div>

        <Field>
          <FieldLabel
            htmlFor="fullName"
            className="text-sm md:text-base font-medium"
          >
            Nama Lengkap
          </FieldLabel>
          <Input
            id="fullName"
            placeholder="Contoh: Jhon Doe"
            {...register("fullName")}
            disabled={isSubmitting}
            className="bg-background h-10 md:h-11"
          />
          <ErrorMsg msg={errors.fullName?.message} />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="username"
            className="text-sm md:text-base font-medium"
          >
            Username
          </FieldLabel>
          <Input
            id="username"
            placeholder="jhondoe123"
            {...register("username")}
            disabled={isSubmitting}
            className="bg-background h-10 md:h-11"
          />
          <ErrorMsg msg={errors.username?.message} />
        </Field>

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
            placeholder="nama@email.com"
            {...register("email")}
            disabled={isSubmitting}
            className="bg-background h-10 md:h-11"
          />
          <FieldDescription className="text-xs md:text-sm text-muted-foreground mt-1.5 leading-snug">
            Kami akan menggunakan email ini untuk menghubungi Anda. Kami tidak
            akan membagikan email Anda kepada pihak lain.
          </FieldDescription>
          <ErrorMsg msg={errors.email?.message} />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="password"
            className="text-sm md:text-base font-medium"
          >
            Kata Sandi
          </FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-10 bg-background h-10 md:h-11"
              {...register("password")}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4 md:size-5" />
              ) : (
                <Eye className="size-4 md:size-5" />
              )}
            </button>
          </div>

          <FieldDescription className="text-xs md:text-sm text-muted-foreground mt-1.5 leading-snug">
            Gunakan minimal 8 karakter, 1 angka, 1 simbol. Mohon buat kata sandi baru untuk akun ini, jangan gunakan kata sandi email pribadi Anda.
          </FieldDescription>

          <ErrorMsg msg={errors.password?.message} />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-sm md:text-base font-medium"
          >
            Konfirmasi Kata Sandi
          </FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-10 bg-background h-10 md:h-11"
              {...register("confirmPassword")}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4 md:size-5" />
              ) : (
                <Eye className="size-4 md:size-5" />
              )}
            </button>
          </div>
          <FieldDescription className="text-xs md:text-sm text-muted-foreground mt-1.5 leading-snug">
            Silakan masukkan ulang kata sandi Anda untuk konfirmasi.
          </FieldDescription>
          <ErrorMsg msg={errors.confirmPassword?.message} />
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 md:h-11 font-semibold text-base mt-2 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Buat Akun"
            )}
          </Button>
        </Field>

        <FieldSeparator className="my-2">Atau lanjutkan dengan</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full h-10 md:h-11 bg-background hover:bg-muted/50"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="mr-2 h-4 w-4"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Daftar dengan Google
          </Button>
          <FieldDescription className="text-center mt-4 text-sm md:text-base">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Masuk
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
