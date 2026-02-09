"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminUserSchema } from "@/schemas";
import { User } from "@/types";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (data: User) => Promise<void>;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: yupResolver(adminUserSchema) as any,
    defaultValues: {
      uid: "",
      id: "",
      lastName: "",
      firstName: "",
      email: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: User) => {
    await onSubmit(data);
  };

  const editingId = user?.uid && user.uid !== "new" ? user.uid : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b border-neutral-100 bg-neutral-50 p-6">
          <DialogTitle className="text-xl font-medium tracking-tight">
            {editingId ? "病院ユーザーの編集" : "新規ユーザー登録"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-6 px-8 text-[13px]">
            {editingId ? (
              <div className="space-y-2">
                <Label htmlFor="id" className="text-xs font-semibold text-neutral-400 uppercase">
                  病院ユーザーID
                </Label>
                <div className="truncate rounded border border-dashed bg-neutral-50 p-2 font-mono text-sm text-neutral-400">
                  {editingId}
                </div>
              </div>
            ) : (
              <div className="mb-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-base font-medium text-blue-700">
                新規ユーザーの初期パスワードは <strong>password1234</strong> です。
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">姓</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  disabled={isSubmitting}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-[10px] font-medium text-red-500">{errors.lastName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">名</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  disabled={isSubmitting}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-[10px] font-medium text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={isSubmitting}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-[10px] font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>権限</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-white font-medium text-neutral-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">病院管理者</SelectItem>
                      <SelectItem value="user">一般</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 border-t border-neutral-100 bg-neutral-50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3f65b8] px-8 hover:bg-[#345399]"
            >
              {isSubmitting ? "保存中..." : editingId ? "保存する" : "登録する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
