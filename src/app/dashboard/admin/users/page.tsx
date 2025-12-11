"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { UserProfile, AdminUpdateUserRequest } from "@/types/user";
import { ApiError } from "@/services/api";
import { toast } from "sonner";
import { useLogout } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, MoreHorizontal, Search, Trash, Edit, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null); // State untuk dialog hapus

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getMe(),
  });
  const currentUser = meData?.data;

  // Fetch Users
  const { data: response, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => userService.adminListUsers({ page, limit: 10, search }),
  });

  const userList = response?.data; 

  // Mutation Delete
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => userService.adminDeleteUser(id),
    onSuccess: () => {
      toast.success("User berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeletingUser(null); // Tutup dialog
    },
    onError: (err: ApiError) => {
      // Backend akan mengirim pesan spesifik (misal: "Super Admin tidak bisa dihapus")
      toast.error(err.message || "Gagal menghapus user");
      setDeletingUser(null);
    },
  });

  // Mutation Update
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: (vars: { id: string; data: AdminUpdateUserRequest }) =>
      userService.adminUpdateUser(vars.id, vars.data),

    onSuccess: (_data, variables) => {
      toast.success("User berhasil diupdate");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);

      // Logika Logout jika edit diri sendiri & ganti role
      if (currentUser && variables.id === currentUser.id) {
        if (variables.data.role && variables.data.role !== currentUser.role) {
            toast.warning("Status akun Anda berubah. Mohon login kembali.", {
                duration: 3000,
            });
            setTimeout(() => logout(), 1000);
        }
      }
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const formData = new FormData(e.currentTarget);
    
    const payload: AdminUpdateUserRequest = {
      fullName: formData.get("fullName") as string,
      username: formData.get("username") as string,
      role: formData.get("role") as "user" | "admin",
      status: formData.get("status") as "pending" | "active" | "suspended",
    };

    updateUser({ id: editingUser.id, data: payload });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-jakarta">Manajemen User</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari user..."
            className="pl-8"
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); 
            }}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : !userList?.items || userList.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Tidak ada data user.
                </TableCell>
              </TableRow>
            ) : (
              userList.items.map((user) => {
                // Cek apakah ini diri sendiri
                const isMe = currentUser?.id === user.id;

                return (
                  <TableRow key={user.id} className={isMe ? "bg-muted/30" : ""}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl || ""} />
                        <AvatarFallback>{user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                          {user.fullName}
                          {isMe && <Badge variant="secondary" className="text-[10px] h-5">You</Badge>}
                        </span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                          variant="outline" 
                          className={
                              user.status === 'active' ? 'text-green-600 border-green-600' : 
                              user.status === 'suspended' ? 'text-red-600 border-red-600' : 
                              'text-yellow-600 border-yellow-600'
                          }
                      >
                          {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-sm text-muted-foreground">
                        {user.authProvider}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          
                          {/* UX: Disable tombol hapus jika itu diri sendiri */}
                          <DropdownMenuItem 
                              onClick={() => setDeletingUser(user)} 
                              className="text-red-600 focus:text-red-600"
                              disabled={isMe} 
                          >
                            <Trash className="mr-2 h-4 w-4" /> 
                            {isMe ? "Hapus (Disabled)" : "Hapus"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
        >
            Previous
        </Button>
        <Button 
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={!userList || page >= userList.totalPages || isLoading}
        >
            Next
        </Button>
      </div>

      {/* --- DIALOG EDIT --- */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label>Nama Lengkap</Label>
                <Input name="fullName" defaultValue={editingUser.fullName} />
              </div>
              <div className="grid gap-2">
                <Label>Username</Label>
                <Input name="username" defaultValue={editingUser.username} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Role</Label>
                    <Select name="role" defaultValue={editingUser.role}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select name="status" defaultValue={editingUser.status}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>Batal</Button>
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="animate-spin" /> : "Simpan"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* --- ALERT DIALOG DELETE (Pengganti window.confirm) --- */}
      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="h-5 w-5" />
                Hapus User?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus user <strong>{deletingUser?.fullName}</strong>? <br/>
              Tindakan ini tidak dapat dibatalkan dan semua data terkait (enrollment, pembayaran) mungkin akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
                onClick={(e) => {
                    e.preventDefault(); // prevent auto close, tunggu mutation selesai
                    if (deletingUser) deleteUser(deletingUser.id);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}