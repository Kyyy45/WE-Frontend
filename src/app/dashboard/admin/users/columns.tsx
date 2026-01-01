"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MoreHorizontal, Trash2, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axios";
import { toast } from "sonner";

// Definisi aksi (Delete, dll) di sini agar bisa akses refresh function nanti
interface ActionProps {
  user: User;
  onSuccess: () => void;
}

const UserActions = ({ user, onSuccess }: ActionProps) => {
  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user ${user.username}?`))
      return;

    try {
      await api.delete(`/users/${user.id}`);
      toast.success("User berhasil dihapus");
      onSuccess();
    } catch {
      toast.error("Gagal menghapus user");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.id)}
        >
          Salin User ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Fungsi pembantu untuk membuat columns dengan refresh callback
export const getColumns = (onDataChanged: () => void): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: "Pengguna",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
            <AvatarFallback>
              {user.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium truncate max-w-37.5">
              {user.fullName}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-37.5">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.username}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          variant={role === "admin" ? "default" : "secondary"}
          className="capitalize"
        >
          {role === "admin" ? (
            <Shield className="w-3 h-3 mr-1" />
          ) : (
            <UserIcon className="w-3 h-3 mr-1" />
          )}
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "outline";

      if (status === "active") variant = "default"; // Hijau/Hitam (tergantung theme)
      if (status === "suspended") variant = "destructive"; // Merah
      if (status === "pending") variant = "secondary"; // Abu-abu

      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Bergabung",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-xs">
          {format(new Date(row.original.createdAt), "dd MMM yyyy", {
            locale: id,
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <UserActions user={row.original} onSuccess={onDataChanged} />
    ),
  },
];
