"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios";
import { User} from "@/types/user";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // [ANALISIS MATCH]
      // Panggil /users. Karena baseURL axios sudah .../api,
      // maka ini akan menembak ke: https://[domain]/api/users
      const res = await api.get("/users");

      console.log("DEBUG RESPONSE:", res.data); // Cek F12 jika masih error

      // [AUTO-DETECT STRUCTURE]
      // Backend controller: res.json({ success: true, data })
      // Kita perlu cek isi 'data' apakah Array langsung atau Object Pagination
      const responseData = res.data.data;
      
      let users: User[] = [];

      if (Array.isArray(responseData)) {
        // Kasus 1: Backend kirim array langsung
        users = responseData;
      } else if (responseData && Array.isArray(responseData.results)) {
        // Kasus 2: Backend kirim pagination { results: [...], total: ... }
        users = responseData.results;
      } else if (responseData && Array.isArray(responseData.users)) {
        // Kasus 3: Backend kirim object { users: [...] }
        users = responseData.users;
      } else {
        console.warn("Format data tidak dikenali:", responseData);
      }

      setData(users);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Fetch Error:", error);
      if (error.response?.status === 404) {
        toast.error("Endpoint tidak ditemukan. Cek konfigurasi /api di backend.");
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

  // Client-side filtering
  const filteredData = data.filter((user) =>
    user.fullName?.toLowerCase().includes(filter.toLowerCase()) ||
    user.email?.toLowerCase().includes(filter.toLowerCase()) ||
    user.username?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
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
            <DataTable 
              columns={getColumns(fetchData)} 
              data={filteredData} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}