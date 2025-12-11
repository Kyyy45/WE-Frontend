"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activationSchema, ActivationSchema } from "@/schemas/auth.schema";
import { useVerifyActivation, useResendActivation } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";

function ActivationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const { mutate: verify, isPending: isVerifying } = useVerifyActivation();
  const { mutate: resend, isPending: isResending } = useResendActivation();

  const form = useForm<ActivationSchema>({
    resolver: zodResolver(activationSchema),
    defaultValues: { code: "" },
  });

  return (
    <AuthLayout 
      title="Verifikasi Akun" 
      description={`Masukkan 6 digit kode yang telah dikirim ke email ${email || "Anda"}.`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => verify({ email, code: v.code }))} className="flex flex-col gap-6">
          
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Kode OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold" disabled={isVerifying}>
            {isVerifying && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Verifikasi Akun
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Tidak menerima kode?{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal text-primary underline" 
          onClick={() => resend({ email })} 
          disabled={isResending}
        >
          {isResending ? "Mengirim..." : "Kirim Ulang"}
        </Button>
      </div>
    </AuthLayout>
  );
}

export default function ActivationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ActivationContent />
    </Suspense>
  );
}