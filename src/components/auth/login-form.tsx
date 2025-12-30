"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { loginSchema, type LoginValues } from "@/lib/validations";
import Link from "next/link";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs font-medium text-destructive mt-1.5 animate-in slide-in-from-top-1">
      {msg}
    </p>
  ) : null;

const setAuthCookie = (token: string) => {
  document.cookie = `refreshToken=${token}; path=/; secure; samesite=lax; max-age=604800`;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      // 1. POST Login: Backend sekarang mengembalikan token di body response juga
      const response = await api.post("/auth/login", data);

      // Ambil token dari response body
      const { accessToken, refreshToken } = response.data.data;

      // 2. Simpan token akses sementara agar request profil valid
      useAuthStore.getState().setAccessToken(accessToken);

      // 3. Fetch User Profile menggunakan token baru
      const { data: profileRes } = await api.get<{ data: User }>("/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = profileRes.data;

      // 4. Update State Auth Lengkap (3 Parameter: User, AccessToken, RefreshToken)
      setAuth(userData, accessToken, refreshToken);

      // 5. Set Cookie Manual (Menggunakan helper function)
      setAuthCookie(refreshToken);

      toast.success(`Selamat datang kembali, ${userData.fullName}`);
      router.replace("/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Kredensial salah");
      } else {
        toast.error("Gagal login, periksa koneksi internet");
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
            Masuk ke Akun
          </h1>
          <p className="text-muted-foreground text-sm md:text-base text-balance">
            Masukkan kredensial Anda untuk masuk dan mengakses dashboard Anda.
          </p>
        </div>

        <Field>
          <FieldLabel
            htmlFor="usernameOrEmail"
            className="text-sm md:text-base font-medium"
          >
            Email atau Username
          </FieldLabel>
          <Input
            id="usernameOrEmail"
            placeholder="nama@email.com"
            {...register("usernameOrEmail")}
            disabled={isSubmitting}
            className="bg-background h-10 md:h-11"
          />
          <ErrorMsg msg={errors.usernameOrEmail?.message} />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel
              htmlFor="password"
              className="text-sm md:text-base font-medium"
            >
              Kata Sandi
            </FieldLabel>
            <Link
              href="/forgot-password"
              className="text-xs md:text-sm text-primary font-medium hover:underline underline-offset-4"
            >
              Lupa kata sandi?
            </Link>
          </div>
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
          <ErrorMsg msg={errors.password?.message} />
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
              "Masuk"
            )}
          </Button>
        </Field>

        <div className="text-center text-sm md:text-base">
          <Link
            href="/resend-verification"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Belum verifikasi akun?{" "}
            <span className="underline underline-offset-4">
              Kirim ulang kode
            </span>
          </Link>
        </div>

        <FieldSeparator className="my-2">Atau masuk dengan</FieldSeparator>

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
            Login dengan Google
          </Button>
          <FieldDescription className="text-center mt-4 text-sm md:text-base">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Daftar sekarang
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
