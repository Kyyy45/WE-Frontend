"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations";
import Link from "next/link";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs font-medium text-destructive mt-1.5">{msg}</p>
  ) : null;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (!token) {
      toast.error("Link tidak valid atau token hilang.");
      router.replace("/login");
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) return toast.error("Token invalid");

    try {
      await api.post("/auth/password/reset", {
        token: token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success("Password berhasil diubah! Silakan login.");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal mereset password");
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    }
  };

  if (!token) return null;

  return (
    <div className={cn("flex flex-col gap-6 md:gap-8", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Atur kata sandi baru
            </h1>
            <p className="text-muted-foreground text-sm md:text-base text-balance">
              Silakan masukkan kata sandi baru Anda di bawah ini.
            </p>
          </div>

          <Field>
            <FieldLabel
              htmlFor="password"
              className="text-sm md:text-base font-medium"
            >
              Kata Sandi Baru
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pr-10 bg-background h-10 md:h-11"
                {...register("password")}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4 md:size-5" />
                ) : (
                  <Eye className="size-4 md:size-5" />
                )}
              </button>
            </div>
            <ErrorMsg msg={errors.password?.message} />
            <FieldDescription className="text-xs md:text-sm">
              Gunakan minimal 8 karakter, 1 angka, 1 simbol.
            </FieldDescription>
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
                className="pr-10 bg-background h-10 md:h-11"
                {...register("confirmPassword")}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4 md:size-5" />
                ) : (
                  <Eye className="size-4 md:size-5" />
                )}
              </button>
            </div>
            <ErrorMsg msg={errors.confirmPassword?.message} />
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 md:h-11 font-semibold text-base mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Reset Password"
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
