"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
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
import { Loader2, User, Mail, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/lib/validations";

export function ProfileForm() {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Backend: PATCH /users/me (Body: { username })
      const res = await api.patch("/users/me", data);

      // Response backend: { success: true, data: UserObject }
      if (res.data.success && res.data.data) {
        // Update username di store
        updateUser({
          username: res.data.data.username,
        });
        toast.success("Username berhasil diperbarui!");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal update profil");
      }
    }
  };

  if (!user) return null;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Data Diri</CardTitle>
        <CardDescription className="text-muted-foreground">
          Kelola identitas akun Anda di Worldpedia.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Email (Read Only) */}
          <div className="grid gap-2">
            <Label className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
              <Input
                value={user.email}
                disabled
                className="pl-9 bg-muted text-muted-foreground border-input cursor-not-allowed opacity-100"
              />
            </div>
          </div>

          {/* Nama Lengkap (Read Only - Backend Restriction) */}
          <div className="grid gap-2">
            <Label className="text-foreground">Nama Lengkap</Label>
            <div className="relative">
              <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
              <Input
                value={user.fullName}
                disabled
                className="pl-9 bg-muted text-muted-foreground border-input cursor-not-allowed opacity-100"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Untuk mengubah nama lengkap, silakan hubungi Admin.
            </p>
          </div>

          {/* Username (Editable) */}
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-foreground">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                {...register("username")}
                className={`pl-9 bg-background border-input ${
                  errors.username
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="username"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-destructive font-medium animate-in fade-in-50">
                {errors.username.message}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground">
              Hanya huruf dan angka, minimal 4 karakter.
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border px-6 py-4 bg-muted/20">
          <Button type="submit" disabled={isSubmitting} className="ml-auto">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Perubahan
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
