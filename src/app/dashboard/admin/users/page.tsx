"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios";
import { User } from "@/types/user";
import { DataTable } from "@/components/ui/data-table"; // Pastikan path ini benar sesuai struktur project Anda
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

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Fungsi Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil endpoint GET /users
      // Asumsi response backend: { success: true, data: { results: User[], ... } } atau { data: User[] }
      const res = await api.get("/users");

      // Sesuaikan dengan struktur response backend Anda
      // Jika backend mengirim array langsung di res.data.data
      const users = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data.results || [];

      setData(users);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch saat mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter Client-side sederhana
  const filteredData = data.filter(
    (user) =>
      user.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()) ||
      user.username.toLowerCase().includes(filter.toLowerCase())
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
