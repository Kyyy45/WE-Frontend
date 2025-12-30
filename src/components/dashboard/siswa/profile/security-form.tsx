"use client";

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
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordValues } from "@/lib/validations";

export function SecurityForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      // Backend: PATCH /users/me/password
      // Body: { oldPassword, newPassword }
      await api.patch("/users/me/password", {
        oldPassword: data.oldPassword, // Key backend: oldPassword
        newPassword: data.newPassword,
      });

      toast.success("Password berhasil diubah!");
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal mengubah password");
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
          <div className="grid gap-2">
            <Label htmlFor="oldPassword" className="text-foreground">
              Password Lama
            </Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="oldPassword"
                type="password"
                {...register("oldPassword")}
                className="pl-9 bg-background border-input"
              />
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-destructive">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword" className="text-foreground">
              Password Baru
            </Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                className="pl-9 bg-background border-input"
              />
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Konfirmasi Password Baru
            </Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="pl-9 bg-background border-input"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-border px-6 py-4 bg-muted/20">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Ganti Password
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
