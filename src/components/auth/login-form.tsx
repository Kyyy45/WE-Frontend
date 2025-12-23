"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // Tambahan
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
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Tambahan
import { toast } from "sonner"; // Tambahan
import { api } from "@/lib/axios"; // Tambahan
import { useAuthStore } from "@/stores/auth-store"; // Tambahan
import { AxiosError } from "axios"; // Tambahan
import { User } from "@/types/user"; // Tambahan

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter(); // Tambahan
  const setAuth = useAuthStore((state) => state.setAuth); // Tambahan
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false); // Tambahan
  
  const [formData, setFormData] = React.useState({
    usernameOrEmail: "", // Sesuaikan dengan backend DTO
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mapping input 'email' dari UI ke 'usernameOrEmail' untuk backend
    const key = e.target.id === 'email' ? 'usernameOrEmail' : e.target.id;
    setFormData({ ...formData, [key]: e.target.value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Login request
      const { data: loginRes } = await api.post<{ data: { accessToken: string } }>('/auth/login', formData);
      const accessToken = loginRes.data.accessToken;

      // 2. Set token sementara agar request profile berhasil
      useAuthStore.getState().setAccessToken(accessToken);

      // 3. Fetch user profile (Opsional tapi disarankan agar data user langsung ada)
      // Kalau endpoint /users/me belum siap, bisa di-skip atau mock data dulu.
      // Kita pakai try-catch silent agar login tetap lanjut meski fetch profile gagal.
      let userData = null;
      try {
         // Asumsi endpoint profile ada. Jika tidak, login tetap sukses.
         const { data: profileRes } = await api.get<{ data: User }>('/users/me'); 
         userData = profileRes.data;
      } catch (err) {
         console.log("Profile fetch skipped/failed", err);
         // Fallback dummy user jika endpoint belum ada
         userData = { _id: "temp", role: "user", status: "active", email: formData.usernameOrEmail, fullName: "User", username: "user", authProvider: "local", createdAt: "", updatedAt: "" } as User;
      }

      // 4. Update Global Store
      setAuth(userData, accessToken);
      
      toast.success("Login berhasil!");
      router.push('/dashboard');

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Email atau password salah");
      } else {
        toast.error("Gagal login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            type="text" // Bisa text agar user bisa input username juga
            placeholder="m@example.com or username" 
            required 
            value={formData.usernameOrEmail}
            onChange={handleChange}
            disabled={isLoading}
          />
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
              required
              className="pr-10"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
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
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
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