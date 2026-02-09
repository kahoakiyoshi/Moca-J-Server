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
import { patientSchema } from "@/schemas";
import { Patient } from "@/types";

interface PatientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSubmit: (data: Patient) => Promise<void>;
}

export const PatientEditDialog: React.FC<PatientEditDialogProps> = ({
  open,
  onOpenChange,
  patient,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Patient>({
    resolver: yupResolver(patientSchema) as any,
    defaultValues: {
      id: "",
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      gender: "女性",
      birthYear: "1990",
      birthMonth: "01",
      birthDay: "01",
      zip: "",
      prefecture: "",
      city: "",
      address1: "",
      building: "",
      education: "高卒より上",
    },
  });

  useEffect(() => {
    if (patient) {
      reset(patient);
    }
  }, [patient, reset]);

  const editingId = patient?.uid || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b border-neutral-100 bg-neutral-50 p-6">
          <DialogTitle className="text-xl font-medium tracking-tight">
            {editingId ? "患者情報編集" : "新規患者登録"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8 p-8 text-[13px]">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="id">
                  患者ID{" "}
                  {editingId ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-neutral-400">(空の場合は自動採番)</span>
                  )}
                </Label>
                <Input
                  id="id"
                  {...register("id")}
                  disabled={isSubmitting || !!editingId}
                  placeholder={editingId ? "" : "例: 000001"}
                  className={errors.id ? "border-red-500 focus:ring-red-500/20" : ""}
                />
                {errors.id && (
                  <p className="text-[10px] font-medium text-red-500">{errors.id.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>性別</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="男性">男性</SelectItem>
                        <SelectItem value="女性">女性</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  姓 <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="firstName">
                  名 <span className="text-red-500">*</span>
                </Label>
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

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lastNameKana">
                  姓 (かな) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastNameKana"
                  {...register("lastNameKana")}
                  disabled={isSubmitting}
                  className={errors.lastNameKana ? "border-red-500" : ""}
                />
                {errors.lastNameKana && (
                  <p className="text-[10px] font-medium text-red-500">
                    {errors.lastNameKana.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstNameKana">
                  名 (かな) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstNameKana"
                  {...register("firstNameKana")}
                  disabled={isSubmitting}
                  className={errors.firstNameKana ? "border-red-500" : ""}
                />
                {errors.firstNameKana && (
                  <p className="text-[10px] font-medium text-red-500">
                    {errors.firstNameKana.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="mb-4 block border-b pb-2 font-semibold text-neutral-900">
                基本属性
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>生年</Label>
                  <Controller
                    name="birthYear"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => 1930 + i).map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}年
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>誕生月</Label>
                  <Controller
                    name="birthMonth"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(
                            (m) => (
                              <SelectItem key={m} value={m}>
                                {m}月
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>誕生日</Label>
                  <Controller
                    name="birthDay"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map(
                            (d) => (
                              <SelectItem key={d} value={d}>
                                {d}日
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Label className="mb-4 block border-b pb-2 font-semibold text-neutral-900">
                住所情報
              </Label>
              <div className="space-y-2">
                <Label htmlFor="zip">
                  郵便番号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zip"
                  placeholder="000-0000"
                  {...register("zip")}
                  disabled={isSubmitting}
                  className={errors.zip ? "border-red-500" : ""}
                />
                {errors.zip && (
                  <p className="text-[10px] font-medium text-red-500">{errors.zip.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    都道府県 <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="prefecture"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className={errors.prefecture ? "border-red-500" : ""}>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="東京都">東京都</SelectItem>
                          <SelectItem value="大阪府">大阪府</SelectItem>
                          <SelectItem value="神奈川県">神奈川県</SelectItem>
                          <SelectItem value="埼玉県">埼玉県</SelectItem>
                          <SelectItem value="千葉県">千葉県</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.prefecture && (
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.prefecture.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">
                    市区町村 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    disabled={isSubmitting}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-[10px] font-medium text-red-500">{errors.city.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address1">
                  丁目・番地 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address1"
                  {...register("address1")}
                  disabled={isSubmitting}
                  className={errors.address1 ? "border-red-500" : ""}
                />
                {errors.address1 && (
                  <p className="text-[10px] font-medium text-red-500">{errors.address1.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="building">建物名・部屋番号</Label>
                <Input id="building" {...register("building")} disabled={isSubmitting} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 border-t border-neutral-100 bg-neutral-50 p-6">
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
