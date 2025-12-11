"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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
import { Separator } from "@/components/ui/separator";
import { setCookie } from "@/lib/cookies";

import { authService } from "@/services/auth.service";
import { loginSchema, type LoginSchema } from "@/schemas/auth.schema";
import { AuthLayout } from "@/components/auth/auth-layout";
import { userService } from "@/services/user.service";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "suspended") {
      toast.error("Akses Ditolak", {
        description: "Akun Google ditangguhkan.",
      });
      router.replace("/login");
    } else if (error === "google_auth_failed") {
      toast.error("Login Gagal", { description: "Gagal login dengan Google." });
      router.replace("/login");
    }
  }, [searchParams, router]);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { usernameOrEmail: "", password: "" },
  });

  async function onSubmit(values: LoginSchema) {
    setIsLoading(true);
    try {
      const response = await authService.login(values);
      if (response.data?.accessToken) {
        setCookie("accessToken", response.data.accessToken);
      } else if ("accessToken" in response) {
        // @ts-expect-error handling dynamic response
        setCookie("accessToken", response.accessToken);
      }

      toast.success("Login Berhasil");
      const userRes = await userService.getMe();
      const user = userRes.data;

      if (user?.role === "admin") router.push("/dashboard/admin");
      else router.push("/dashboard/student");

      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = (error.message || "").toLowerCase();
      if (message.includes("aktif") || error.status === 403) {
        toast.warning("Akun Belum Aktif", {
          description: "Verifikasi email Anda.",
          action: {
            label: "Aktivasi",
            onClick: () =>
              router.push(
                `/activation?email=${encodeURIComponent(values.usernameOrEmail)}`
              ),
          },
        });
      } else {
        toast.error("Login Gagal", {
          description: error.message || "Periksa data Anda.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Selamat Datang"
      description="Masuk ke akun Worldpedia Anda"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email / Username</FormLabel>
                <FormControl>
                  <Input placeholder="siswa@worldpedia.id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Masuk
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground uppercase">Atau</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" className="w-full" asChild>
        <a href={authService.getGoogleAuthUrl()}>
          <FcGoogle className="mr-2 h-5 w-5" />
          Masuk dengan Google
        </a>
      </Button>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <div className="text-sm">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold underline hover:text-primary transition-colors"
          >
            Daftar Sekarang
          </Link>
        </div>
        <div className="text-xs text-muted-foreground">
          Akun belum aktif?{" "}
          <Link
            href="/activation/resend"
            className="underline hover:text-foreground transition-colors"
          >
            Aktivasi manual di sini
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
