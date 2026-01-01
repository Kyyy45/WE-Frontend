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

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Fungsi Fetch Data
  // ... imports

  // Fungsi Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");

      // [DEBUGGING] Cek hasil respon di Console Browser (Tekan F12 -> Console)
      console.log("FULL RESPONSE API USERS:", res.data);

      // LOGIKA PENCOCOKAN DATA YANG LEBIH FLEKSIBEL
      let users: User[] = [];

      // Kemungkinan 1: Langsung Array (res.data = [...])
      if (Array.isArray(res.data)) {
        users = res.data;
      }
      // Kemungkinan 2: Terbungkus 'data' (res.data = { data: [...] })
      else if (Array.isArray(res.data.data)) {
        users = res.data.data;
      }
      // Kemungkinan 3: Pagination / Results (res.data = { data: { results: [...] } })
      else if (res.data.data?.results && Array.isArray(res.data.data.results)) {
        users = res.data.data.results;
      }
      // Kemungkinan 4: Pagination dengan key 'users' (res.data = { data: { users: [...] } })
      else if (res.data.data?.users && Array.isArray(res.data.data.users)) {
        users = res.data.data.users;
      }

      console.log("Users yang berhasil di-parse:", users);
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
