"use client";

import { useState, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/axios";
import { getCroppedImg } from "@/lib/image-crop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Camera,
  Upload,
  ZoomIn,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export function AvatarUpload() {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States untuk Cropper
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  // 1. Handle File Selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validasi Ukuran (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB");
        return;
      }

      // Validasi Tipe File
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setIsDialogOpen(true); // Buka modal crop
      });
      reader.readAsDataURL(file);
    }
  };

  // 2. Handle Crop Completion
  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // 3. Handle Upload Process
  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setLoading(true);

      // Proses Crop (Client Side) -> Menghasilkan Blob
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Gagal memproses gambar");

      // --- KUNCI KECOCOKAN DENGAN BACKEND ---
      const payload = new FormData();
      // Key harus "avatar" sesuai upload.single("avatar") di backend
      payload.append("avatar", croppedBlob, "avatar.jpg");

      // Kirim ke Backend Endpoint PATCH /users/me/avatar
      const { data } = await api.patch("/users/me/avatar", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update State Global dengan URL baru dari backend
      if (data.success && data.data) {
        updateUser({ avatarUrl: data.data.avatarUrl });
        toast.success("Foto profil berhasil diperbarui!");
      }

      setIsDialogOpen(false);
      setImageSrc(null);
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Gagal mengunggah gambar.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Foto Profil</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sesuaikan posisi foto agar terlihat pas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="h-24 w-24 border-2 border-border transition-opacity group-hover:opacity-90">
              <AvatarImage
                src={user.avatarUrl || ""}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
                {user.fullName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full">
              <Camera className="w-8 h-8 text-white drop-shadow-md" />
            </div>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full backdrop-blur-sm z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-medium text-foreground">Upload Foto Baru</h3>
            <p className="text-xs text-muted-foreground">
              Format JPG, PNG, WEBP. Maksimal 2MB.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-input hover:bg-accent"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Pilih Gambar
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal Cropper */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Sesuaikan Foto</DialogTitle>
          </DialogHeader>

          {/* Area Crop */}
          <div className="relative w-full h-64 bg-black rounded-md overflow-hidden mt-4 border border-border">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // Rasio 1:1
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          {/* Slider Zoom */}
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Zoom
              </span>
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3 h-3" /> {zoom.toFixed(1)}x
              </span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(v) => setZoom(v[0])}
            />
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleUpload} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Foto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}