"use client";

import * as React from "react";
import Link from "next/link";
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
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs font-medium text-destructive mt-1.5">{msg}</p>
  ) : null;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await api.post("/auth/password/request-reset", data);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast.success("Link reset password telah dikirim ke email Anda.");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Gagal memproses permintaan"
        );
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    }
  };

  if (isSuccess) {
    return (
      <div
        className={cn(
          "flex flex-col gap-6 text-center max-w-sm mx-auto",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-green-500/15 p-4 text-green-600 dark:text-green-400 ring-1 ring-inset ring-green-500/20 shadow-sm">
            <Mail className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Periksa email Anda
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Kami telah mengirimkan tautan untuk mereset kata sandi ke{" "}
              <span className="font-semibold text-foreground block mt-1">
                {submittedEmail}
              </span>
            </p>
          </div>
        </div>
        <div className="text-center text-sm md:text-base">
          <Link
            href="/login"
            className="text-muted-foreground underline hover:text-primary transition-colors underline-offset-4"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 md:gap-8", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Lupa Kata Sandi
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Masukkan alamat email Anda, dan kami akan mengirimkan tautan untuk
              mereset kata sandi Anda.
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
              "Kirim Link Reset"
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
