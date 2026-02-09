"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "@/schemas";
import { authService } from "@/services";

import { ChangePasswordForm } from "./change-password/ChangePasswordForm";

const ChangePasswordScreen: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await authService.changePassword(data);
      alert("パスワードを変更しました");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        setError("現在のパスワードが正しくありません");
      } else {
        setError("パスワードの変更に失敗しました。もう一度お試しください。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 items-start justify-center pt-12 duration-500">
      <Card className="w-full max-w-md overflow-hidden border-neutral-200 shadow-xl">
        <CardHeader className="bg-[#3f65b8] p-6 text-white">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-wide">
            <Lock size={20} />
            パスワード変更
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}
          <ChangePasswordForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordScreen;
