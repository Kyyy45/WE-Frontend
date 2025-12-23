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
    <p className="text-[0.8rem] font-medium text-red-500 mt-1 text-center">
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
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
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
        toast.error(
          error.response?.data?.message || "Kode salah atau kadaluarsa"
        );
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Enter verification code</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a 6-digit code to your email{" "}
              <span className="font-medium text-foreground">
                {emailFromUrl}
              </span>
              .
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
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
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <ErrorMsg msg={errors.code?.message} />

            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-2">
            Didn&apos;t receive the code?{" "}
            {countdown > 0 ? (
              <span className="font-medium text-orange-600">
                Resend in {countdown}s
              </span>
            ) : (
              <a
                href="#"
                onClick={handleResend}
                className="underline hover:text-foreground font-medium"
              >
                Resend Code
              </a>
            )}
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
