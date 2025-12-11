"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Eye, EyeOff } from "lucide-react"; // Tambah import Eye & EyeOff

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { userService } from "@/services/user.service";
import { ApiError } from "@/services/api";
import { UserProfile } from "@/types/user";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileSchema,
  type ChangePasswordSchema,
} from "@/schemas/user.schema";

export default function SettingsPage() {
  // 1. Fetch Data User
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getMe(),
  });
  const user = userProfile?.data;

  // 2. Tab State
  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) return <div>Loading...</div>;

  // Cek apakah user login via Google
  const isGoogleUser = user?.authProvider === "google";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-jakarta">Pengaturan Akun</h1>
        <p className="text-muted-foreground">
          Kelola profil dan keamanan akun Anda.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-lg">
        <TabsList className="w-auto inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="profile" className="px-4">
            Profil
          </TabsTrigger>
          {!isGoogleUser && (
            <TabsTrigger value="security" className="px-4">
              Keamanan
            </TabsTrigger>
          )}
        </TabsList>

        {/* TAB 1: EDIT PROFILE */}
        <div className="mt-4">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Update foto profil dan username Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Avatar Section */}
                <AvatarUpload user={user} />

                {/* Form Update Username */}
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* TAB 2: CHANGE PASSWORD */}
          {!isGoogleUser && (
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Ganti Password</CardTitle>
                  <CardDescription>
                    Pastikan password Anda aman dan tidak mudah ditebak.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordForm />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}

// --- SUB-COMPONENT: AVATAR UPLOAD ---
function AvatarUpload({ user }: { user: UserProfile | undefined }) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi Client Side Basic
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setIsUploading(true);
    try {
      await userService.updateAvatar(file);
      toast.success("Foto profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Gagal upload avatar";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-20 w-20 border-2 border-muted">
        <AvatarImage src={user?.avatarUrl || ""} />
        <AvatarFallback>
          {user?.fullName?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="relative cursor-pointer"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Mengupload..." : "Ganti Foto"}
          <input
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, atau WEBP. Maks 2MB.
        </p>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: PROFILE FORM ---
function ProfileForm({ user }: { user: UserProfile | undefined }) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: UpdateProfileSchema) => userService.updateProfile(data),
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: ApiError) =>
      toast.error(err.message || "Gagal update profil"),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => updateProfile(v))}
        className="space-y-4"
      >
        <div className="grid gap-2">
          <FormLabel>Nama Lengkap (Tidak dapat diubah)</FormLabel>
          <Input value={user?.fullName || ""} disabled className="bg-muted" />
        </div>
        <div className="grid gap-2">
          <FormLabel>Email (Tidak dapat diubah)</FormLabel>
          <Input value={user?.email || ""} disabled className="bg-muted" />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Perubahan
        </Button>
      </form>
    </Form>
  );
}

// --- SUB-COMPONENT: PASSWORD FORM (UPDATED) ---
function PasswordForm() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { mutate: changePass, isPending } = useMutation({
    mutationFn: (data: ChangePasswordSchema) =>
      userService.changePassword(data),
    onSuccess: () => {
      toast.success("Password berhasil diubah");
      form.reset();
    },
    onError: (err: ApiError) =>
      toast.error(err.message || "Gagal ganti password"),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => changePass(v))}
        className="space-y-4 max-w-lg"
      >
        {/* Old Password */}
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Lama</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showOldPass ? "text" : "password"} 
                    {...field} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowOldPass(!showOldPass)}
                  >
                    {showOldPass ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showNewPass ? "text" : "password"} 
                    {...field} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showConfirmPass ? "text" : "password"} 
                    {...field} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ganti Password
        </Button>
      </form>
    </Form>
  );
}