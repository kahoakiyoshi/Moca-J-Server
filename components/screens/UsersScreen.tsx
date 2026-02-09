"use client";

import React, { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services";
import { useUsers } from "@/hooks/use-users";
import { User } from "@/types";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface UserFilters {
  id: string;
  searchName: string;
}

import { UserSearchForm } from "./users/UserSearchForm";
import { UserEditDialog } from "./users/UserEditDialog";

const UsersScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const initialFilters = {
    id: searchParams.get("id") || "",
    searchName: searchParams.get("searchName") || "",
  };

  const {
    users,
    isLoading: loading,
    refetch,
  } = useUsers({
    id: initialFilters.id,
    searchName: initialFilters.searchName,
  });

  const onSearchSubmit = (data: UserFilters) => {
    const params = new URLSearchParams();
    if (data.id) params.set("id", data.id);
    if (data.searchName) params.set("searchName", data.searchName);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  const openEditModal = (user: Partial<User>) => {
    setEditingUser(user as User);
    setEditModalOpen(true);
  };

  const onSubmit = async (data: User) => {
    try {
      await userService.saveUser(data, !editingUser?.uid || editingUser.uid === "new");
      await refetch();
      setEditModalOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "ユーザーの保存に失敗しました");
    }
  };

  const handleDelete = async (uid: string) => {
    if (window.confirm("このユーザーを削除してもよろしいですか？")) {
      try {
        await userService.deleteUser(uid);
        await refetch();
      } catch (error: any) {
        console.error(error);
        alert(error.message || "ユーザーの削除に失敗しました");
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col duration-500">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-light tracking-tight text-neutral-800">病院ユーザー</h2>
        <Button
          onClick={() =>
            openEditModal({ id: "new", lastName: "", firstName: "", email: "", role: "user" })
          }
          className="h-10 bg-[#3f65b8] px-6 hover:bg-[#345399]"
        >
          <Plus className="mr-2 h-4 w-4" /> ユーザー追加
        </Button>
      </div>

      <UserSearchForm
        initialFilters={initialFilters}
        onSearch={onSearchSubmit}
        onClear={handleClear}
      />

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead className="w-64 font-semibold text-neutral-600">病院ユーザーID</TableHead>
              <TableHead className="w-48 font-semibold text-neutral-600">氏名</TableHead>
              <TableHead className="font-semibold text-neutral-600">メールアドレス</TableHead>
              <TableHead className="w-24 text-center font-semibold text-neutral-600">
                権限
              </TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    読み込み中...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-neutral-400">
                  データがありません
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: User) => (
                <TableRow key={user.uid} className="transition-colors hover:bg-neutral-50/50">
                  <TableCell className="py-4 font-mono text-[13px] text-neutral-500">
                    {user.uid}
                  </TableCell>
                  <TableCell className="py-4 font-medium text-neutral-900">
                    {user.lastName} {user.firstName}
                  </TableCell>
                  <TableCell className="py-4 font-normal text-neutral-600">{user.email}</TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={
                        user.role === "admin"
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-50"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100"
                      }
                    >
                      {user.role === "admin" ? "管理者" : "一般"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0 hover:bg-neutral-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-neutral-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="animate-in fade-in zoom-in-95 w-32 duration-200"
                      >
                        <DropdownMenuItem
                          onClick={() => openEditModal(user)}
                          className="cursor-pointer"
                        >
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.uid)}
                          className="cursor-pointer text-red-500 focus:text-red-600"
                        >
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserEditDialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={editingUser}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default UsersScreen;
