"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema, type VerifyValues } from "@/lib/validations";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs font-medium text-destructive mt-2 text-center animate-in slide-in-from-top-1">
      {msg}
    </p>
  ) : null;

export function VerifyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailFromUrl,
      code: "",
    },
  });

  React.useEffect(() => {
    if (!emailFromUrl) {
      toast.error("Email tidak ditemukan. Silakan minta kode baru.");
      router.push("/resend-verification");
    }
  }, [emailFromUrl, router]);

  const onSubmit = async (data: VerifyValues) => {
    try {
      await api.post("/auth/activation/verify", {
        email: emailFromUrl,
        code: data.code,
      });
      toast.success("Aktivasi berhasil! Silakan login.");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Kode salah/kadaluarsa");
      } else {
        toast.error("Gagal verifikasi");
      }
    }
  };

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (countdown > 0) return;
    if (!emailFromUrl) return toast.error("Email tidak ditemukan");

    try {
      await api.post("/auth/activation/send", { email: emailFromUrl });
      toast.success("Kode baru telah dikirim ke email");
      setCountdown(60);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal kirim ulang");
      } else {
        toast.error("Gagal mengirim ulang kode");
      }
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-sm mx-auto", className)}
      {...props}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Verifikasi Email
            </h1>
            <p className="text-muted-foreground text-sm md:text-base text-balance">
              Kode 6 digit telah dikirim ke{" "}
              <span className="font-semibold text-foreground block mt-1">
                {emailFromUrl}
              </span>
            </p>
          </div>
          <Field className="flex flex-col items-center">
            <FieldLabel htmlFor="otp" className="sr-only">
              Kode verifikasi
            </FieldLabel>

            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  id="otp"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="h-12 w-12 text-lg font-semibold bg-background border-input first:rounded-l-md"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-12 w-12 text-lg font-semibold bg-background border-input"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-12 w-12 text-lg font-semibold bg-background border-input"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="h-12 w-12 text-lg font-semibold bg-background border-input"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-12 w-12 text-lg font-semibold bg-background border-input"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-12 w-12 text-lg font-semibold bg-background border-input last:rounded-r-md"
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <ErrorMsg msg={errors.code?.message} />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 md:h-11 font-semibold text-base mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Verifikasi"
              )}
            </Button>

            <div className="text-center text-sm md:text-base text-muted-foreground mt-4">
              Tidak menerima kode?{" "}
              {countdown > 0 ? (
                <span className="font-medium text-orange-600 block sm:inline transition-colors">
                  Tunggu {countdown} detik
                </span>
              ) : (
                <a
                  href="#"
                  onClick={handleResend}
                  className="underline hover:text-primary font-medium transition-colors underline-offset-4"
                >
                  Kirim Ulang
                </a>
              )}
            </div>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
