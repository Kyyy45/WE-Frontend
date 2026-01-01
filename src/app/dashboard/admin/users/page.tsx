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
import { toast } from "sonner";
import { AxiosError } from "axios"; // Import AxiosError

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");

      console.log("DEBUG API RESPONSE:", res.data);

      const responseData = res.data.data;
      let users: User[] = [];

      if (Array.isArray(responseData)) {
        users = responseData;
      } else if (responseData?.items && Array.isArray(responseData.items)) {
        users = responseData.items;
      } else if (responseData?.results && Array.isArray(responseData.results)) {
        users = responseData.results;
      } else if (responseData?.users && Array.isArray(responseData.users)) {
        users = responseData.users;
      }

      setData(users);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);

      // [FIX] Hapus 'any'
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Sesi habis. Silakan login ulang.");
        } else {
          toast.error("Gagal memuat data pengguna.");
        }
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui.");
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
                {/* [FIX] Ganti w-[250px] jadi w-64 */}
                <Input
                  placeholder="Cari nama, email..."
                  className="pl-9 w-64"
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
