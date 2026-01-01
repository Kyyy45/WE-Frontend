"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios";
import { User } from "@/types/user";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Import toast untuk feedback error

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil endpoint users
      const res = await api.get("/users");

      console.log("DEBUG API RESPONSE:", res.data);

      const responseData = res.data.data;
      let users: User[] = [];

      // [FIX LOGIC PARSING] Sesuaikan dengan format 'items' dari backend
      if (Array.isArray(responseData)) {
        // 1. Jika array langsung
        users = responseData;
      } else if (responseData?.items && Array.isArray(responseData.items)) {
        // 2. [MATCH] Jika format pagination menggunakan 'items' (Sesuai Log Anda)
        users = responseData.items;
      } else if (responseData?.results && Array.isArray(responseData.results)) {
        // 3. Jika format pagination menggunakan 'results'
        users = responseData.results;
      } else if (responseData?.users && Array.isArray(responseData.users)) {
        // 4. Jika format pagination menggunakan 'users'
        users = responseData.users;
      } else {
        console.warn("Format data user tidak dikenali:", responseData);
      }

      console.log("Users berhasil di-parse:", users);
      setData(users);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Gagal mengambil data user:", error);
      
      // Handle 401 Unauthorized secara spesifik jika perlu
      if (error.response?.status === 401) {
        // Biasanya middleware axios sudah handle logout, tapi kita bisa kasih info extra
        toast.error("Sesi habis. Silakan login ulang.");
      } else {
        toast.error("Gagal memuat data pengguna.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(filter.toLowerCase()) ||
      user.email?.toLowerCase().includes(filter.toLowerCase()) ||
      user.username?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Manajemen Pengguna
        </h1>
        <p className="text-muted-foreground">
          Kelola data siswa dan administrator sistem.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Pengguna</CardTitle>
              <CardDescription>
                Total {data.length} pengguna terdaftar.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, email..."
                  className="pl-9 w-62.5"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable columns={getColumns(fetchData)} data={filteredData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}