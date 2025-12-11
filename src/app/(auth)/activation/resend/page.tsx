"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/schemas/auth.schema";
import { useResendActivation } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function ResendActivationPage() {
  const router = useRouter();
  const { mutate: resend, isPending } = useResendActivation();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordSchema) {
    resend(values, {
      onSuccess: () => {
        setCooldown(60);
        setTimeout(() => {
           router.push(`/activation?email=${encodeURIComponent(values.email)}`);
        }, 1500);
      },
    });
  }

  return (
    <AuthLayout 
      title="Kirim Ulang Kode" 
      description="Masukkan email yang Anda gunakan saat mendaftar untuk menerima kode aktivasi baru."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="contoh@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
            disabled={isPending || cooldown > 0}
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</>
            ) : cooldown > 0 ? (
              `Tunggu ${cooldown}s`
            ) : (
              "Kirim Kode"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Login
        </Link>
      </div>
    </AuthLayout>
  );
}