"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Eye, EyeOff } from "lucide-react";

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
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getMe(),
  });
  const user = userProfile?.data;

  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) return <div>Loading...</div>;

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

        <div className="mt-4">
          {/* TAB 1: EDIT PROFILE */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Update foto profil dan username Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AvatarUpload user={user} />
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

// --- SUB-COMPONENT: AVATAR UPLOAD (WITH PREVIEW) ---
function AvatarUpload({ user }: { user: UserProfile | undefined }) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreview(objectUrl);
    
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      await userService.updateAvatar(file);
      toast.success("Foto profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      
      setFile(null);
      setPreview(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal upload avatar";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-20 w-20 border-2 border-muted">
        <AvatarImage src={preview || user?.avatarUrl || ""} />
        <AvatarFallback>
          {user?.fullName?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2">
        {file ? (
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isUploading ? "Menyimpan..." : "Simpan Foto"}
            </Button>
            <Button variant="ghost" onClick={handleCancel} disabled={isUploading}>
              Batal
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="relative cursor-pointer"
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Ganti Foto
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground">
          {file ? `File terpilih: ${file.name}` : "JPG, PNG, atau WEBP. Maks 2MB."}
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

// --- SUB-COMPONENT: PASSWORD FORM ---
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