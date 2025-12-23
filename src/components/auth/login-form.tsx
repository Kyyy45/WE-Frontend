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
import { useAuthStore } from "@/stores/auth-store";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { loginSchema, type LoginValues } from "@/lib/validations";
import Link from "next/link";

// PERBAIKAN: Pindah ke luar
const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-[0.8rem] font-medium text-red-500 mt-1">{msg}</p>
  ) : null;

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
      const { data: loginRes } = await api.post<{
        data: { accessToken: string };
      }>("/auth/login", data);
      const accessToken = loginRes.data.accessToken;

      useAuthStore.getState().setAccessToken(accessToken);

      let userData = null;
      try {
        const { data: profileRes } = await api.get<{ data: User }>("/users/me");
        userData = profileRes.data;
      } catch {
        userData = {
          _id: "temp",
          fullName: "User",
          email: data.usernameOrEmail,
        } as User;
      }

      setAuth(userData, accessToken);
      toast.success("Login berhasil!");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Kredensial salah");
      } else {
        toast.error("Gagal login");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="usernameOrEmail">Email or Username</FieldLabel>
          <Input
            id="usernameOrEmail"
            placeholder="m@example.com"
            {...register("usernameOrEmail")}
            disabled={isSubmitting}
          />
          <ErrorMsg msg={errors.usernameOrEmail?.message} />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="pr-10"
              {...register("password")}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <div className="text-center text-sm">
          <Link
            href="/resend-verification"
            className="text-muted-foreground underline hover:text-primary"
          >
            Belum verifikasi akun? Kirim ulang kode
          </Link>
        </div>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full"
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
            Login with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
