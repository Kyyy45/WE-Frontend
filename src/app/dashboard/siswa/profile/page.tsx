"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordValues } from "@/lib/validations";

export function SecurityForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    // Validasi manual tambahan di frontend sebelum kirim
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    try {
      // Payload Backend: Wajib ada confirmNewPassword
      const payload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword, // Field ini krusial
      };

      console.log("Sending payload:", payload); // Cek console browser F12 jika masih gagal

      await api.patch("/users/me/password", payload);

      toast.success("Password berhasil diubah! Silakan login ulang.");
      reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: unknown) {
      console.error("Change Password Error:", error);

      if (error instanceof AxiosError) {
        const errorData = error.response?.data;

        if (errorData?.errors && Array.isArray(errorData.errors)) {
          // Tampilkan pesan error validasi pertama yang spesifik
          const firstError = errorData.errors[0];
          toast.error(`${firstError.path || "Input"}: ${firstError.msg}`);
        } else {
          // Fallback message
          toast.error(errorData?.message || "Gagal mengubah password.");
        }
      } else {
        toast.error("Terjadi kesalahan sistem.");
      }
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Ganti Kata Sandi</CardTitle>
        <CardDescription className="text-muted-foreground">
          Gunakan minimal 8 karakter kombinasi huruf besar, kecil, angka, dan
          simbol.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* PASSWORD LAMA */}
          <div className="grid gap-2">
            <Label htmlFor="oldPassword">Password Lama</Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                {...register("oldPassword")}
                className="pl-9 pr-10"
                placeholder="Password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-destructive">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* PASSWORD BARU */}
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                className="pl-9 pr-10"
                placeholder="Password baru"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* KONFIRMASI */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="pl-9 pr-10"
                placeholder="Ulangi password baru"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 px-6 py-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Simpan Password Baru"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
