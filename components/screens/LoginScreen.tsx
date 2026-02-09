"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schemas";
import { authService } from "@/services";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface LoginScreenProps {
  onLogin: () => void;
}

import { LoginForm } from "./login/LoginForm";

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      setError("このアカウントには管理者権限がありません。");
    }
  }, [searchParams]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await authService.login(data);
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md overflow-hidden border-neutral-200 shadow-lg">
        <CardHeader className="bg-[#3f65b8] p-6 text-white">
          <CardTitle className="text-center text-xl font-semibold tracking-wide uppercase">
            ログイン
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pb-0">
          {error && (
            <div className="animate-in fade-in zoom-in-95 mb-6 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
          <LoginForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </CardContent>
        <CardFooter className="flex flex-col items-center p-8 pt-4">
          <a
            href="#"
            className="text-sm font-medium text-[#3f65b8] decoration-2 transition-all hover:text-[#345399] hover:underline"
          >
            パスワードをお忘れの方はこちら
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
